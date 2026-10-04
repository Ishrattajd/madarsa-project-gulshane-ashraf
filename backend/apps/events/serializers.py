"""Serializers for the events app."""

from rest_framework import serializers
from .models import Event, EventImage


class EventImageSerializer(serializers.ModelSerializer):
    """Serializer for individual event gallery images."""

    class Meta:
        model = EventImage
        fields = ["id", "event", "image", "caption", "order", "created_at"]


class EventSerializer(serializers.ModelSerializer):
    """Serializes all Event fields including nested images."""

    images = EventImageSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
