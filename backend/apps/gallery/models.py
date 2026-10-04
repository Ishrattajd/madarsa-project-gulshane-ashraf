"""
gallery app — photo/video albums for the institution.
"""

from django.db import models


class GalleryAlbum(models.Model):
    """
    Groups a set of GalleryItems under a named album.
    cover_image is shown on album listing pages.
    """

    title = models.CharField(max_length=200)
    cover_image = models.ImageField(upload_to="gallery/covers/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Gallery Album"
        verbose_name_plural = "Gallery Albums"

    def __str__(self):
        return self.title


class GalleryItem(models.Model):
    """
    A single photo or embedded video within a GalleryAlbum.
    Provide either image or video_url — not both.
    """

    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name="items")
    image = models.ImageField(upload_to="gallery/items/", blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="YouTube/Vimeo embed URL.")
    caption = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Gallery Item"
        verbose_name_plural = "Gallery Items"

    def __str__(self):
        return f"{self.album.title} — {self.caption or self.pk}"
