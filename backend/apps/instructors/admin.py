"""Admin registration for the instructors app."""

from django.contrib import admin
from .models import Instructor


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ("name", "show_photo", "is_active", "created_at")
    list_filter = ("is_active", "show_photo")
    search_fields = ("name",)
    list_editable = ("show_photo", "is_active")
