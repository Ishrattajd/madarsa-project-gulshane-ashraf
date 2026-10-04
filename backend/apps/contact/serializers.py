"""Serializers for the contact app."""

from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """Handles public submission and admin read."""

    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ("is_read", "created_at")
