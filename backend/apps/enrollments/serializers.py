"""Serializers for the enrollments app."""

from rest_framework import serializers
from .models import EnrollmentApplication


class EnrollmentApplicationSerializer(serializers.ModelSerializer):
    """Handles both public submission (create) and admin read/update."""

    class Meta:
        model = EnrollmentApplication
        fields = "__all__"
        read_only_fields = ("status", "created_at")
