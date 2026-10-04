"""Serializers for the core app."""

from rest_framework import serializers
from .models import BannerImage, SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializes all fields of the singleton SiteSettings.
    founder_name and founder_title are included automatically via __all__.
    """

    class Meta:
        model = SiteSettings
        fields = "__all__"


class BannerImageSerializer(serializers.ModelSerializer):
    """Public serializer for hero carousel slides."""

    class Meta:
        model = BannerImage
        fields = [
            "id",
            "title",
            "subtitle",
            "image",
            "order",
            "is_active",
        ]
