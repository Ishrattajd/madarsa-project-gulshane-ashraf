"""Serializers for the gallery app."""

from rest_framework import serializers
from .models import GalleryAlbum, GalleryItem


class GalleryItemSerializer(serializers.ModelSerializer):
    """Serializes a single gallery item (image or video)."""

    class Meta:
        model = GalleryItem
        fields = "__all__"


class GalleryAlbumSerializer(serializers.ModelSerializer):
    """Serializes an album together with its nested items."""

    items = GalleryItemSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = ("id", "title", "cover_image", "created_at", "items")
