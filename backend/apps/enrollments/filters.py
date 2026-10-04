"""Filters for the enrollments app."""

import django_filters
from .models import EnrollmentApplication


class EnrollmentApplicationFilter(django_filters.FilterSet):
    """Filter enrollment applications by status for admin dashboard."""

    class Meta:
        model = EnrollmentApplication
        fields = ["status"]
