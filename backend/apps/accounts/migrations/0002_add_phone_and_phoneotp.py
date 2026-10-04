"""
Migration 0002: Bring accounts schema in line with current models.

Changes from 0001_initial:
- email: was NOT NULL unique; make it nullable (null=True, blank=True)
- phone: new field (CharField 10, unique, null=True, blank=True, indian validator)
- PhoneOTP: new model
"""

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from datetime import timedelta
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        # 1. Make email nullable
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(
                blank=True,
                max_length=254,
                null=True,
                unique=True,
            ),
        ),
        # 2. Add phone field
        migrations.AddField(
            model_name="user",
            name="phone",
            field=models.CharField(
                blank=True,
                help_text="10-digit Indian mobile number used for OTP login.",
                max_length=10,
                null=True,
                unique=True,
                validators=[
                    django.core.validators.RegexValidator(
                        regex=r"^[6-9]\d{9}$",
                        message="Enter a valid 10-digit Indian mobile number starting with 6-9.",
                    )
                ],
            ),
        ),
        # 3. Create PhoneOTP table
        migrations.CreateModel(
            name="PhoneOTP",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "phone",
                    models.CharField(
                        max_length=10,
                        validators=[
                            django.core.validators.RegexValidator(
                                regex=r"^[6-9]\d{9}$",
                                message="Enter a valid 10-digit Indian mobile number starting with 6-9.",
                            )
                        ],
                    ),
                ),
                ("code", models.CharField(max_length=6)),
                (
                    "purpose",
                    models.CharField(
                        choices=[("admin", "Admin Login"), ("donor", "Donor Verification")],
                        max_length=10,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("expires_at", models.DateTimeField()),
                ("is_used", models.BooleanField(default=False)),
                ("attempts", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "verbose_name": "Phone OTP",
                "verbose_name_plural": "Phone OTPs",
                "ordering": ["-created_at"],
            },
        ),
    ]
