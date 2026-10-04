"""Views for the core app."""

from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet

from .models import BannerImage, SiteSettings
from .serializers import BannerImageSerializer, SiteSettingsSerializer


class SiteSettingsPublicView(RetrieveAPIView):
    """Public read-only endpoint returning the singleton site settings.
    Includes founder_name and founder_title so frontend never hardcodes them.
    """

    permission_classes = [AllowAny]
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.load()


class SiteSettingsAdminView(RetrieveUpdateAPIView):
    """Admin-only endpoint to GET or PATCH the singleton site settings.

    Changed from UpdateAPIView → RetrieveUpdateAPIView so the admin form
    can GET the current record before PATCHing it (UpdateAPIView returned
    405 on GET, blocking the settings page from loading).
    """

    permission_classes = [IsAdminUser]
    serializer_class = SiteSettingsSerializer
    http_method_names = ['get', 'patch', 'put', 'head', 'options']

    def get_object(self):
        return SiteSettings.load()


class BannerImagePublicListView(ListAPIView):
    """Public list of active banner images, ordered by `order` field."""

    permission_classes = [AllowAny]
    serializer_class = BannerImageSerializer
    queryset = BannerImage.objects.filter(is_active=True)
    pagination_class = None  # Return all active banners — carousel doesn't paginate


class BannerImageAdminViewSet(ModelViewSet):
    """Admin full CRUD for hero carousel banner images."""

    permission_classes = [IsAdminUser]
    serializer_class = BannerImageSerializer
    queryset = BannerImage.objects.all()
