"""Admin registration for the donations app."""

from django.contrib import admin
from .models import DonationFund, Donation


@admin.register(DonationFund)
class DonationFundAdmin(admin.ModelAdmin):
    list_display = ("name_en", "is_active")
    list_editable = ("is_active",)
    search_fields = ("name_en", "name_ur", "name_kn")


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ("donor_name", "fund", "amount", "currency", "status", "is_recurring", "created_at")
    list_filter = ("status", "is_recurring", "fund")
    search_fields = ("donor_name", "donor_email", "razorpay_order_id", "razorpay_payment_id")
    readonly_fields = ("razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "created_at")
