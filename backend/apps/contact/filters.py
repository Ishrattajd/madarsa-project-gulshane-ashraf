"""Filters for the contact app."""

import django_filters
from .models import ContactMessage


class ContactMessageFilter(django_filters.FilterSet):
    """Filter contact messages by read status for admin dashboard."""

    class Meta:
        model = ContactMessage
        fields = ["is_read"]
