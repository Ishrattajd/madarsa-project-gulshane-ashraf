"""URL patterns for the core app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BannerImageAdminViewSet,
    BannerImagePublicListView,
    SiteSettingsAdminView,
    SiteSettingsPublicView,
)

router = DefaultRouter()
router.register(r"admin/banner-images", BannerImageAdminViewSet, basename="admin-banner-images")

urlpatterns = [
    path("site-settings/", SiteSettingsPublicView.as_view(), name="site-settings-public"),
    path("admin/site-settings/", SiteSettingsAdminView.as_view(), name="site-settings-admin"),
    path("banner-images/", BannerImagePublicListView.as_view(), name="banner-images-public"),
    path("", include(router.urls)),
]
