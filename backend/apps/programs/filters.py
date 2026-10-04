"""Filters for the programs app."""

import django_filters
from .models import Program


class ProgramFilter(django_filters.FilterSet):
    """Filter programs by active status."""

    class Meta:
        model = Program
        fields = ["is_active"]
