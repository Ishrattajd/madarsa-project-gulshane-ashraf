"""Views for the accounts app — OTP send and verify flows."""

from django.utils import timezone
from rest_framework import serializers as drf_serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PhoneOTP, User
from .services import generate_otp, send_otp
from .throttles import OTPSendThrottle
from .tokens import create_donor_token


# ---------------------------------------------------------------------------
# Input serializers (inline — thin, no business logic)
# ---------------------------------------------------------------------------

class SendOTPSerializer(drf_serializers.Serializer):
    phone = drf_serializers.RegexField(
        regex=r"^[6-9]\d{9}$",
        error_messages={"invalid": "Enter a valid 10-digit Indian mobile number."},
    )
    purpose = drf_serializers.ChoiceField(choices=PhoneOTP.PURPOSE_CHOICES)


class VerifyOTPSerializer(drf_serializers.Serializer):
    phone = drf_serializers.RegexField(regex=r"^[6-9]\d{9}$")
    otp = drf_serializers.CharField(min_length=6, max_length=6)
    purpose = drf_serializers.ChoiceField(choices=PhoneOTP.PURPOSE_CHOICES)


# ---------------------------------------------------------------------------
# Views
# ---------------------------------------------------------------------------

class SendOTPView(APIView):
    """
    POST /api/v1/auth/otp/send/
    Body: {phone, purpose}
    Generates a 6-digit OTP, persists it, and dispatches via the configured
    SMS backend. The code is NEVER returned in the HTTP response.
    Rate-limited to 5 requests/minute per phone number.
    """

    permission_classes = [AllowAny]
    throttle_classes = [OTPSendThrottle]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone"]
        purpose = serializer.validated_data["purpose"]

        # Invalidate any existing unused OTPs for this phone+purpose to prevent
        # old codes from being replayed after a new one is requested.
        PhoneOTP.objects.filter(
            phone=phone, purpose=purpose, is_used=False
        ).update(is_used=True)

        code = generate_otp()
        PhoneOTP.objects.create(phone=phone, code=code, purpose=purpose)
        send_otp(phone, code)

        return Response(
            {"detail": "OTP sent successfully."},
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    """
    POST /api/v1/auth/otp/verify/
    Body: {phone, otp, purpose}

    On success:
      purpose=admin  → JWT access+refresh tokens (same shape as /api/token/).
      purpose=donor  → short-lived donor_verification_token (15 min).
    On failure:
      400 with detail message; attempts incremented on each wrong code.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone"]
        otp = serializer.validated_data["otp"]
        purpose = serializer.validated_data["purpose"]

        # Find the most recent valid OTP record for this phone+purpose
        try:
            record = (
                PhoneOTP.objects
                .filter(phone=phone, purpose=purpose, is_used=False)
                .latest("created_at")
            )
        except PhoneOTP.DoesNotExist:
            return Response(
                {"detail": "No active OTP found. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.is_expired:
            return Response(
                {"detail": "OTP has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.is_exhausted:
            return Response(
                {"detail": "Too many failed attempts. Please request a new OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if record.code != otp:
            record.attempts += 1
            record.save(update_fields=["attempts"])
            return Response(
                {"detail": "Incorrect OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # --- Code is correct ---
        record.is_used = True
        record.save(update_fields=["is_used"])

        if purpose == PhoneOTP.PURPOSE_ADMIN:
            return self._handle_admin_verify(phone)
        return self._handle_donor_verify(phone)

    # ------------------------------------------------------------------

    def _handle_admin_verify(self, phone: str) -> Response:
        """Issue JWT tokens for a verified admin phone number."""
        try:
            user = User.objects.get(phone=phone, is_staff=True, is_active=True)
        except User.DoesNotExist:
            return Response(
                {"detail": "Not authorized as admin."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )

    def _handle_donor_verify(self, phone: str) -> Response:
        """Issue a short-lived donor verification token for the verified phone."""
        token = create_donor_token(phone)
        return Response(
            {"donor_verification_token": token},
            status=status.HTTP_200_OK,
        )
