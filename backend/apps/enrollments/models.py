"""
enrollments app — student enrollment application submissions.
"""

from django.core.validators import EmailValidator, RegexValidator
from django.db import models

phone_validator = RegexValidator(
    regex=r"^\+?1?\d{7,15}$",
    message="Enter a valid phone number (7-15 digits, optional leading +)."
)


class EnrollmentApplication(models.Model):
    """
    Submitted enrollment form from a prospective student/parent.
    Status is managed by admin staff to track follow-up.
    """

    STATUS_PENDING = "pending"
    STATUS_CONTACTED = "contacted"
    STATUS_ENROLLED = "enrolled"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONTACTED, "Contacted"),
        (STATUS_ENROLLED, "Enrolled"),
    ]

    student_name = models.CharField(max_length=200)
    parent_name = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, validators=[phone_validator])
    email = models.CharField(max_length=254, blank=True, validators=[EmailValidator()])
    program = models.ForeignKey(
        "programs.Program", on_delete=models.SET_NULL, null=True, related_name="enrollments"
    )
    age = models.PositiveSmallIntegerField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Enrollment Application"
        verbose_name_plural = "Enrollment Applications"

    def __str__(self):
        return f"{self.student_name} — {self.program} ({self.status})"
