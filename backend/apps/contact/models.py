"""
contact app — general contact message submissions from the public.
"""

from django.core.validators import EmailValidator
from django.db import models


class ContactMessage(models.Model):
    """
    A general-purpose contact form submission.
    is_read is toggled by admin staff once the message has been reviewed.
    """

    name = models.CharField(max_length=200)
    email = models.CharField(max_length=254, validators=[EmailValidator()])
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"{self.name} — {self.subject or '(no subject)'}"
