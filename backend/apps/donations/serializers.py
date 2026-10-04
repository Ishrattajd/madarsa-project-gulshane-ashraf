"""Serializers for the donations app."""

from rest_framework import serializers
from .models import Donation, DonationFund


class DonationFundSerializer(serializers.ModelSerializer):
    """Public serializer for donation fund categories."""

    class Meta:
        model = DonationFund
        fields = ("id", "name_en", "name_ur", "name_kn", "description", "is_active")


class CreateOrderSerializer(serializers.Serializer):
    """Input serializer for the create-order endpoint."""

    fund = serializers.PrimaryKeyRelatedField(queryset=DonationFund.objects.filter(is_active=True))
    donor_name = serializers.CharField(max_length=200)
    donor_email = serializers.EmailField(required=False, allow_blank=True)
    donor_phone = serializers.RegexField(
        regex=r"^[6-9]\d{9}$",
        max_length=10,
        error_messages={"invalid": "Enter a valid 10-digit Indian mobile number."},
    )
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=1)
    currency = serializers.CharField(max_length=3, default="INR")
    is_recurring = serializers.BooleanField(default=False)
    donor_verification_token = serializers.CharField(
        help_text="Short-lived token returned by POST /api/v1/auth/otp/verify/ (purpose=donor)."
    )


class VerifyPaymentSerializer(serializers.Serializer):
    """Input serializer for the verify-payment endpoint."""

    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class DonationSerializer(serializers.ModelSerializer):
    """Admin serializer exposing all donation fields."""

    class Meta:
        model = Donation
        fields = "__all__"
