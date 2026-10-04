"""URL patterns for the volunteers app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteerCreateView, VolunteerAdminViewSet

router = DefaultRouter()
router.register("admin/volunteers", VolunteerAdminViewSet, basename="admin-volunteers")

urlpatterns = [
    path("volunteers/", VolunteerCreateView.as_view(), name="volunteers-create"),
    path("", include(router.urls)),
]
