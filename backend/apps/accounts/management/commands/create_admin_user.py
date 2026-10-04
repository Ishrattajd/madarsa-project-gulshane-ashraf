"""
Management command: create_admin_user

Creates the placeholder admin user (phone=9999999999) if it doesn't already
exist. The user is given an unusable password — login is via OTP only.
The client should replace this phone number with the real one once deployed.

Usage:
    python manage.py create_admin_user
    python manage.py create_admin_user --phone 9876543210  # override phone
"""

from django.core.management.base import BaseCommand
from apps.accounts.models import User


class Command(BaseCommand):
    help = "Create (or update) the placeholder admin user for OTP-based login."

    def add_arguments(self, parser):
        parser.add_argument(
            "--phone",
            default="9999999999",
            help="10-digit Indian mobile number for the admin user (default: 9999999999).",
        )

    def handle(self, *args, **options):
        phone = options["phone"]

        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        if not created:
            # Ensure existing record has correct flags (idempotent re-run).
            updated = False
            for field, value in [("is_staff", True), ("is_superuser", True), ("is_active", True)]:
                if getattr(user, field) != value:
                    setattr(user, field, value)
                    updated = True
            if updated:
                user.save(update_fields=["is_staff", "is_superuser", "is_active"])
                self.stdout.write(self.style.WARNING(f"Updated existing admin user phone={phone}."))
            else:
                self.stdout.write(self.style.WARNING(f"Admin user phone={phone} already exists — no changes made."))
        else:
            # New user: set unusable password so only OTP login works.
            user.set_unusable_password()
            user.save(update_fields=["password"])
            self.stdout.write(
                self.style.SUCCESS(
                    f"Created admin user: phone={phone}, is_staff=True, is_superuser=True, password=unusable."
                )
            )
