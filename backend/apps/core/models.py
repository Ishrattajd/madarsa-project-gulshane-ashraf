"""
core app — singleton SiteSettings model + BannerImage for the hero carousel.
"""

from django.db import models


class SiteSettings(models.Model):
    """
    Singleton model storing institution-wide settings such as name, tagline,
    contact details, social links, and theme colors.
    Also holds founder_name and founder_title so those strings are never
    hard-coded in any frontend component — edit them at /admin/settings.
    Only one row should exist; save() enforces this via pk=1.
    """

    institution_name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300, blank=True)
    mission = models.TextField(blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)

    # Founder / leadership — displayed on Home and About pages
    founder_name = models.CharField(max_length=200, blank=True)
    founder_title = models.CharField(max_length=200, blank=True)
    founder_photo = models.ImageField(upload_to="site/", blank=True, null=True)

    # Social links
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)

    # Theme colors (hex strings, e.g. "#1a2b3c")
    primary_color = models.CharField(max_length=10, default="#1B4332")
    secondary_color = models.CharField(max_length=10, default="#D4A017")

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.institution_name

    def save(self, *args, **kwargs):
        """Enforce singleton: always reuse pk=1."""
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={"institution_name": "Gulshan-e-Ashraf Arbi Madarsa"},
        )
        return obj


class BannerImage(models.Model):
    """
    A single slide in the homepage hero carousel.
    `order` is added from day one so slides can be reordered without a
    later migration touching production data.
    Only slides with is_active=True are served to the public API.
    """

    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=400, blank=True)
    image = models.ImageField(upload_to="banners/")
    order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        help_text="Lower numbers appear first in the carousel.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name = "Banner Image"
        verbose_name_plural = "Banner Images"

    def __str__(self):
        return self.title or f"Banner #{self.pk}"
