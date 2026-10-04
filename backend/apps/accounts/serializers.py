# apps/accounts/serializers.py
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for admin user — never expose password."""

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "is_staff", "is_active", "date_joined")
        read_only_fields = ("id", "date_joined")
