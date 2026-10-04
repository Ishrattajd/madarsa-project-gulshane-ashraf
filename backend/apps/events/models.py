"""
events app — published events and announcements.
Trilingual content with optional cover image.
"""

from django.db import models


class Event(models.Model):
    """
    An institutional event or announcement with multilingual content.
    Only events with is_published=True are returned to public consumers.
    """

    title_en = models.CharField(max_length=200, verbose_name="Title (English)")
    title_ur = models.CharField(max_length=200, verbose_name="Title (Urdu)", blank=True)
    title_kn = models.CharField(max_length=200, verbose_name="Title (Kannada)", blank=True)

    body_en = models.TextField(verbose_name="Body (English)", blank=True)
    body_ur = models.TextField(verbose_name="Body (Urdu)", blank=True)
    body_kn = models.TextField(verbose_name="Body (Kannada)", blank=True)

    cover_image = models.ImageField(upload_to="events/", blank=True, null=True)
    event_date = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-event_date", "-created_at"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.title_en


class EventImage(models.Model):
    """Multiple gallery photos for an Event."""

    event = models.ForeignKey(Event, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="events/gallery/")
    caption = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name = "Event Image"
        verbose_name_plural = "Event Images"

    def __str__(self):
        return f"Image for {self.event.title_en} (#{self.pk})"
