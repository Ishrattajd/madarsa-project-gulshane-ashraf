"""Admin registration for the accounts app."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import PhoneOTP, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin panel for the custom User model with phone + email support."""

    ordering = ("email",)
    list_display = ("email", "phone", "first_name", "last_name", "is_staff", "is_active")
    search_fields = ("email", "phone", "first_name", "last_name")
    fieldsets = (
        (None, {"fields": ("email", "phone", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "phone", "password1", "password2", "is_staff", "is_superuser"),
        }),
    )
    readonly_fields = ("date_joined",)


@admin.register(PhoneOTP)
class PhoneOTPAdmin(admin.ModelAdmin):
    """Read-only admin view for OTP records."""

    list_display = ("phone", "purpose", "is_used", "attempts", "created_at", "expires_at")
    list_filter = ("purpose", "is_used")
    search_fields = ("phone",)
    readonly_fields = ("phone", "code", "purpose", "created_at", "expires_at", "is_used", "attempts")
    ordering = ("-created_at",)
