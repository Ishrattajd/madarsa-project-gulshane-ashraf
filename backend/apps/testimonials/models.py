"""
testimonials app — curated quotes from parents, donors, and students.
Admin must approve before public display.
"""

from django.db import models


class Testimonial(models.Model):
    """
    A testimonial quote. is_approved=False until an admin reviews it,
    preventing unvetted content from appearing publicly.
    """

    ROLE_PARENT = "parent"
    ROLE_DONOR = "donor"
    ROLE_STUDENT = "student"
    ROLE_CHOICES = [
        (ROLE_PARENT, "Parent"),
        (ROLE_DONOR, "Donor"),
        (ROLE_STUDENT, "Student"),
    ]

    author_name = models.CharField(max_length=200)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    quote_en = models.TextField(verbose_name="Quote (English)", blank=True)
    quote_ur = models.TextField(verbose_name="Quote (Urdu)", blank=True)
    quote_kn = models.TextField(verbose_name="Quote (Kannada)", blank=True)
    photo = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    is_approved = models.BooleanField(
        default=False,
        help_text="Check to make this testimonial visible on the public site."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.author_name} ({self.get_role_display()})"
