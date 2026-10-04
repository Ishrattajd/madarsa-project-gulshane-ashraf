"""URL patterns for the events app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventPublicListView, EventPublicDetailView, EventAdminViewSet, EventImageAdminViewSet

router = DefaultRouter()
router.register("admin/events", EventAdminViewSet, basename="admin-events")
router.register("admin/event-images", EventImageAdminViewSet, basename="admin-event-images")

urlpatterns = [
    path("events/", EventPublicListView.as_view(), name="events-public"),
    path("events/<int:pk>/", EventPublicDetailView.as_view(), name="events-public-detail"),
    path("", include(router.urls)),
]
