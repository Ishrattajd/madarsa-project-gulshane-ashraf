"""Admin registration for the testimonials app."""

from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("author_name", "role", "is_approved", "created_at")
    list_filter = ("is_approved", "role")
    search_fields = ("author_name",)
    list_editable = ("is_approved",)
