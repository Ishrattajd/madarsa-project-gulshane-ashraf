"""Filters for the volunteers app."""

import django_filters
from .models import VolunteerApplication


class VolunteerApplicationFilter(django_filters.FilterSet):
    """Filter volunteer applications by status for admin dashboard."""

    class Meta:
        model = VolunteerApplication
        fields = ["status"]
