"""URL patterns for the accounts app — OTP authentication endpoints."""

from django.urls import path
from .views import SendOTPView, VerifyOTPView

urlpatterns = [
    path("auth/otp/send/", SendOTPView.as_view(), name="otp-send"),
    path("auth/otp/verify/", VerifyOTPView.as_view(), name="otp-verify"),
]
