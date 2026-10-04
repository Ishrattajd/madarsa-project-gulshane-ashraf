"""Filters for the events app."""

import django_filters
from .models import Event


class EventFilter(django_filters.FilterSet):
    """Filter events by published status."""

    class Meta:
        model = Event
        fields = ["is_published"]
