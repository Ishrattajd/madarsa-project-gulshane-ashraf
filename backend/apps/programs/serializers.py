"""Serializers for the programs app."""

from rest_framework import serializers
from .models import Program


class ProgramSerializer(serializers.ModelSerializer):
    """Serializes all Program fields including trilingual content."""

    class Meta:
        model = Program
        fields = "__all__"
