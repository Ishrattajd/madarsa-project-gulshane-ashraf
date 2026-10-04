"""Admin registration for the enrollments app."""

from django.contrib import admin
from .models import EnrollmentApplication


@admin.register(EnrollmentApplication)
class EnrollmentApplicationAdmin(admin.ModelAdmin):
    list_display = ("student_name", "parent_name", "program", "age", "phone", "status", "created_at")
    list_filter = ("status", "program")
    search_fields = ("student_name", "parent_name", "phone", "email")
    list_editable = ("status",)
