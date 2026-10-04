"""
donations app — donation funds and individual donation records with
Razorpay payment gateway integration.
"""

from django.core.validators import EmailValidator
from django.db import models


class DonationFund(models.Model):
    """
    Represents a named fund to which donors can contribute (e.g. Zakat, Sadaqah).
    Trilingual names support the institution's multilingual audience.
    """

    name_en = models.CharField(max_length=100, verbose_name="Name (English)")
    name_ur = models.CharField(max_length=100, verbose_name="Name (Urdu)", blank=True)
    name_kn = models.CharField(max_length=100, verbose_name="Name (Kannada)", blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name_en"]
        verbose_name = "Donation Fund"
        verbose_name_plural = "Donation Funds"

    def __str__(self):
        return self.name_en


class Donation(models.Model):
    """
    Records a single donation transaction linked to a fund.
    Status progresses: created → paid (verified) | failed.
    Payment verification is always done server-side via Razorpay signature.
    """

    STATUS_CREATED = "created"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"
    STATUS_CHOICES = [
        (STATUS_CREATED, "Created"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
    ]

    fund = models.ForeignKey(DonationFund, on_delete=models.PROTECT, related_name="donations")
    donor_name = models.CharField(max_length=200)
    donor_email = models.CharField(max_length=254, blank=True, validators=[EmailValidator()])
    donor_phone = models.CharField(max_length=20, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="INR")

    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=200, blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_CREATED)
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Donation"
        verbose_name_plural = "Donations"

    def __str__(self):
        return f"{self.donor_name} — {self.amount} {self.currency} ({self.status})"
