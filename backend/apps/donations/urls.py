"""URL patterns for the donations app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DonationFundPublicListView,
    DonateStatusView,
    CreateOrderView,
    VerifyPaymentView,
    DonationAdminViewSet,
    DonationFundAdminViewSet,
)

router = DefaultRouter()
router.register("admin/donations", DonationAdminViewSet, basename="admin-donations")
router.register("admin/donation-funds", DonationFundAdminViewSet, basename="admin-donation-funds")

urlpatterns = [
    path("donation-funds/", DonationFundPublicListView.as_view(), name="donation-funds-public"),
    path("donations/status/", DonateStatusView.as_view(), name="donations-status"),
    path("donations/create-order/", CreateOrderView.as_view(), name="donations-create-order"),
    path("donations/verify-payment/", VerifyPaymentView.as_view(), name="donations-verify-payment"),
    path("", include(router.urls)),
]
