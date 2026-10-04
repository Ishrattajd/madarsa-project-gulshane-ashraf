"""Views for the donations app."""

import jwt

from django.conf import settings
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.accounts.tokens import decode_donor_token
from .models import Donation, DonationFund
from .serializers import (
    CreateOrderSerializer,
    DonationFundSerializer,
    DonationSerializer,
    VerifyPaymentSerializer,
)
from .services import create_razorpay_order, verify_razorpay_signature


class DonationFundPublicListView(ListAPIView):
    """Public list of active donation funds."""

    permission_classes = [AllowAny]
    serializer_class = DonationFundSerializer
    queryset = DonationFund.objects.filter(is_active=True)


class DonateStatusView(APIView):
    """
    Public GET — returns is_mock_mode so the /donate page can display
    a 'TEST MODE — NO REAL PAYMENT' banner when mock mode is active.
    This endpoint is intentionally public; it contains no sensitive data.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "is_mock_mode": bool(getattr(settings, "RAZORPAY_MOCK_MODE", False)),
            "razorpay_key_id": settings.RAZORPAY_KEY_ID if not getattr(settings, "RAZORPAY_MOCK_MODE", False) else "",
        })


class CreateOrderView(APIView):
    """
    Public POST — creates a Razorpay order and a pending Donation record.
    Requires a valid donor_verification_token (issued by OTP verify) whose
    embedded phone must match the donor_phone in the request body.
    Returns the Razorpay order_id and public key_id to the frontend.
    Throttled at the global anon rate (20/min).
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # --- Donor phone verification ---
        token = data.pop("donor_verification_token")
        try:
            payload = decode_donor_token(token)
        except jwt.ExpiredSignatureError:
            return Response(
                {"detail": "Donor verification token has expired. Please re-verify your phone."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.InvalidTokenError:
            return Response(
                {"detail": "Invalid donor verification token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payload.get("phone") != data.get("donor_phone"):
            return Response(
                {"detail": "Phone number does not match the verification token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        razorpay_order = create_razorpay_order(float(data["amount"]), data["currency"])

        donation = Donation.objects.create(
            fund=data["fund"],
            donor_name=data["donor_name"],
            donor_email=data.get("donor_email", ""),
            donor_phone=data.get("donor_phone", ""),
            amount=data["amount"],
            currency=data["currency"],
            razorpay_order_id=razorpay_order["id"],
            is_recurring=data.get("is_recurring", False),
            status=Donation.STATUS_CREATED,
        )

        return Response(
            {
                "donation_id": donation.id,
                "razorpay_order_id": razorpay_order["id"],
                "razorpay_key_id": settings.RAZORPAY_KEY_ID,
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyPaymentView(APIView):
    """
    Public POST — verifies Razorpay HMAC-SHA256 signature server-side.
    Only marks the Donation as 'paid' when the signature is genuine.
    Never trusts a success flag sent directly from the frontend.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        is_valid = verify_razorpay_signature(
            data["razorpay_order_id"],
            data["razorpay_payment_id"],
            data["razorpay_signature"],
        )

        if not is_valid:
            return Response(
                {"detail": "Invalid payment signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            donation = Donation.objects.get(razorpay_order_id=data["razorpay_order_id"])
        except Donation.DoesNotExist:
            return Response(
                {"detail": "Donation record not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        donation.razorpay_payment_id = data["razorpay_payment_id"]
        donation.razorpay_signature = data["razorpay_signature"]
        donation.status = Donation.STATUS_PAID
        donation.save(update_fields=["razorpay_payment_id", "razorpay_signature", "status"])

        return Response({"detail": "Payment verified successfully."}, status=status.HTTP_200_OK)


class DonationAdminViewSet(ReadOnlyModelViewSet):
    """
    Admin read-only ViewSet for donation records.
    Donations are never publicly readable.
    """

    permission_classes = [IsAdminUser]
    serializer_class = DonationSerializer
    queryset = Donation.objects.select_related("fund").all()


class DonationFundAdminViewSet(ModelViewSet):
    """Admin full CRUD for donation funds."""

    permission_classes = [IsAdminUser]
    serializer_class = DonationFundSerializer
    queryset = DonationFund.objects.all()
