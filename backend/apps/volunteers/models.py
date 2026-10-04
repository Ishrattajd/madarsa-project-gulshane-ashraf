"""
volunteers app — volunteer interest / application submissions.
"""

from django.core.validators import EmailValidator, RegexValidator
from django.db import models

phone_validator = RegexValidator(
    regex=r"^\+?1?\d{7,15}$",
    message="Enter a valid phone number."
)


class VolunteerApplication(models.Model):
    """
    Submitted volunteer interest form.
    Status tracks admin follow-up similar to enrollment applications.
    """

    STATUS_PENDING = "pending"
    STATUS_CONTACTED = "contacted"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONTACTED, "Contacted"),
    ]

    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, validators=[phone_validator])
    email = models.CharField(max_length=254, blank=True, validators=[EmailValidator()])
    skills = models.TextField(blank=True, help_text="Comma-separated list of skills/areas of interest.")
    availability = models.CharField(max_length=200, blank=True, help_text="e.g. 'Weekends', 'Evenings'")
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Volunteer Application"
        verbose_name_plural = "Volunteer Applications"

    def __str__(self):
        return f"{self.name} ({self.status})"
