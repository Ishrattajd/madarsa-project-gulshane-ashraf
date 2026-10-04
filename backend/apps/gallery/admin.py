"""Admin registration for the gallery app."""

from django.contrib import admin
from .models import GalleryAlbum, GalleryItem


class GalleryItemInline(admin.TabularInline):
    model = GalleryItem
    extra = 1
    fields = ("image", "video_url", "caption")


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    search_fields = ("title",)
    inlines = [GalleryItemInline]


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ("album", "caption", "created_at")
    list_filter = ("album",)
    search_fields = ("caption",)
