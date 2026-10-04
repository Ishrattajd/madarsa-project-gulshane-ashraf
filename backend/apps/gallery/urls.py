"""URL patterns for the gallery app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryPublicListView, GalleryPublicDetailView, GalleryAlbumAdminViewSet, GalleryItemAdminViewSet

router = DefaultRouter()
router.register("admin/gallery-albums", GalleryAlbumAdminViewSet, basename="admin-gallery-albums")
router.register("admin/gallery-items", GalleryItemAdminViewSet, basename="admin-gallery-items")

urlpatterns = [
    path("gallery/", GalleryPublicListView.as_view(), name="gallery-public"),
    path("gallery/<int:pk>/", GalleryPublicDetailView.as_view(), name="gallery-public-detail"),
    path("", include(router.urls)),
]
