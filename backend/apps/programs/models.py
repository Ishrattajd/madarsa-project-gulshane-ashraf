"""
programs app — training programs offered by the institution.
Supports trilingual content (English, Urdu, Kannada).
"""

from django.db import models


class Program(models.Model):
    """
    Represents a training program (e.g. Hifz, Alim course).
    Content is stored in three languages via suffixed fields.
    """

    title_en = models.CharField(max_length=200, verbose_name="Title (English)")
    title_ur = models.CharField(max_length=200, verbose_name="Title (Urdu)", blank=True)
    title_kn = models.CharField(max_length=200, verbose_name="Title (Kannada)", blank=True)

    description_en = models.TextField(verbose_name="Description (English)", blank=True)
    description_ur = models.TextField(verbose_name="Description (Urdu)", blank=True)
    description_kn = models.TextField(verbose_name="Description (Kannada)", blank=True)

    age_group = models.CharField(max_length=100, blank=True, help_text="e.g. '7-14 years'")
    duration = models.CharField(max_length=100, blank=True, help_text="e.g. '2 years'")

    # Nullable fee = free program
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                              help_text="Leave blank for free programs.")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Program"
        verbose_name_plural = "Programs"

    def __str__(self):
        return self.title_en
