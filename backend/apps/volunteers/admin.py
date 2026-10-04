"""Admin registration for the volunteers app."""

from django.contrib import admin
from .models import VolunteerApplication


@admin.register(VolunteerApplication)
class VolunteerApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "phone", "email")
    list_editable = ("status",)
