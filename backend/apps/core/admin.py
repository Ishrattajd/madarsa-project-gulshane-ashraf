"""Admin registration for the core app."""

from django.contrib import admin

from .models import BannerImage, SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Admin for the singleton SiteSettings model."""

    list_display = ("institution_name", "founder_name", "phone", "email")
    fieldsets = (
        ("Institution", {"fields": ("institution_name", "tagline", "mission")}),
        ("Founder / Leadership", {"fields": ("founder_name", "founder_title")}),
        ("Contact", {"fields": ("address", "phone", "email")}),
        ("Social Links", {"fields": ("facebook_url", "instagram_url", "youtube_url", "twitter_url", "whatsapp_number")}),
        ("Theme", {"fields": ("primary_color", "secondary_color")}),
    )

    def has_add_permission(self, request):
        """Allow only one instance."""
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(BannerImage)
class BannerImageAdmin(admin.ModelAdmin):
    """Admin for the hero carousel banner images."""

    list_display = ("__str__", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    ordering = ("order",)
