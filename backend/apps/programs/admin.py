"""Admin registration for the programs app."""

from django.contrib import admin
from .models import Program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("title_en", "age_group", "duration", "fee", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title_en", "title_ur", "title_kn")
    list_editable = ("is_active",)
