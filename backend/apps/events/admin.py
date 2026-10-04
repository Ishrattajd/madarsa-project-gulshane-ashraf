"""Admin registration for the events app."""

from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title_en", "event_date", "is_published", "created_at")
    list_filter = ("is_published",)
    search_fields = ("title_en", "title_ur", "title_kn")
    list_editable = ("is_published",)
    date_hierarchy = "event_date"
