"""
instructors app — faculty/instructor profiles for the institution.
show_photo allows individual instructors to opt out of photo display.
"""

from django.db import models


class Instructor(models.Model):
    """
    Instructor profile with trilingual bio.
    show_photo=False hides the photo in public API responses per individual request.
    """

    name = models.CharField(max_length=200)
    bio_en = models.TextField(verbose_name="Bio (English)", blank=True)
    bio_ur = models.TextField(verbose_name="Bio (Urdu)", blank=True)
    bio_kn = models.TextField(verbose_name="Bio (Kannada)", blank=True)
    photo = models.ImageField(upload_to="instructors/", blank=True, null=True)
    show_photo = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this instructor's photo in public listing."
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Instructor"
        verbose_name_plural = "Instructors"

    def __str__(self):
        return self.name
