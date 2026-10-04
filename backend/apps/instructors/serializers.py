"""Serializers for the instructors app."""

from rest_framework import serializers
from .models import Instructor


class InstructorPublicSerializer(serializers.ModelSerializer):
    """
    Public serializer — returns photo_url only when show_photo is True.
    The photo field is replaced by a nullable photo_url for clarity.
    """

    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Instructor
        fields = ("id", "name", "bio_en", "bio_ur", "bio_kn", "photo_url", "is_active")

    def get_photo_url(self, obj):
        if not obj.show_photo or not obj.photo:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.photo.url)
        return obj.photo.url


class InstructorAdminSerializer(serializers.ModelSerializer):
    """Admin serializer exposing all fields including show_photo and photo."""

    class Meta:
        model = Instructor
        fields = "__all__"
