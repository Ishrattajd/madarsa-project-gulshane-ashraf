"""
accounts app — custom User model (email optional, phone primary for OTP auth)
and PhoneOTP model for OTP-based login and donor verification.
"""

from datetime import timedelta

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

indian_phone_validator = RegexValidator(
    regex=r"^[6-9]\d{9}$",
    message="Enter a valid 10-digit Indian mobile number starting with 6-9.",
)


class UserManager(BaseUserManager):
    """Manager supporting both email and phone-based account creation."""

    def create_user(self, email=None, password=None, **extra_fields):
        if email:
            email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Staff user model for admin dashboard access.
    Email is optional; phone is used for OTP-based login.
    Password login still works for Django /admin/ as a fallback.
    """

    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True,
        validators=[indian_phone_validator],
        help_text="10-digit Indian mobile number used for OTP login.",
    )
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email or self.phone or f"User #{self.pk}"


class PhoneOTP(models.Model):
    """
    One-time password record for phone verification.
    Expires 5 minutes after creation; invalidated after 5 failed attempts.
    Purpose distinguishes admin login from donor phone verification flows.
    """

    PURPOSE_ADMIN = "admin"
    PURPOSE_DONOR = "donor"
    PURPOSE_CHOICES = [
        (PURPOSE_ADMIN, "Admin Login"),
        (PURPOSE_DONOR, "Donor Verification"),
    ]

    phone = models.CharField(max_length=10, validators=[indian_phone_validator])
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Phone OTP"
        verbose_name_plural = "Phone OTPs"

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + timedelta(minutes=5)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_exhausted(self):
        """True when max attempts (5) have been reached."""
        return self.attempts >= 5

    def __str__(self):
        return f"{self.phone} ({self.purpose}) — {'used' if self.is_used else 'active'}"
