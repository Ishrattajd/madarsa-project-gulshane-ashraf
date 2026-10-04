"""Serializers for the volunteers app."""

from rest_framework import serializers
from .models import VolunteerApplication


class VolunteerApplicationSerializer(serializers.ModelSerializer):
    """Handles public submission and admin read."""

    class Meta:
        model = VolunteerApplication
        fields = "__all__"
        read_only_fields = ("status", "created_at")
