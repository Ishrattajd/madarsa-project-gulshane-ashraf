"""Views for the gallery app."""

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import GalleryAlbum, GalleryItem
from .serializers import GalleryAlbumSerializer, GalleryItemSerializer


class GalleryPublicListView(ListAPIView):
    """Public list of all gallery albums with their items nested."""

    permission_classes = [AllowAny]
    serializer_class = GalleryAlbumSerializer
    queryset = GalleryAlbum.objects.prefetch_related("items").all()


class GalleryPublicDetailView(RetrieveAPIView):
    """Public detail of a single gallery album with its items nested."""

    permission_classes = [AllowAny]
    serializer_class = GalleryAlbumSerializer
    queryset = GalleryAlbum.objects.prefetch_related("items").all()


class GalleryAlbumAdminViewSet(ModelViewSet):
    """Admin full CRUD for gallery albums."""

    permission_classes = [IsAdminUser]
    serializer_class = GalleryAlbumSerializer
    queryset = GalleryAlbum.objects.prefetch_related("items").all()


class GalleryItemAdminViewSet(ModelViewSet):
    """Admin full CRUD for individual gallery items."""

    permission_classes = [IsAdminUser]
    serializer_class = GalleryItemSerializer
    queryset = GalleryItem.objects.select_related("album").all()
