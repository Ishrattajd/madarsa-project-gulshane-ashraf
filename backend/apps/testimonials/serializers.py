"""Serializers for the testimonials app."""

from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializes all Testimonial fields."""

    class Meta:
        model = Testimonial
        fields = "__all__"
