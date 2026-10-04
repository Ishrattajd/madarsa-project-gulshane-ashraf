"""URL patterns for the instructors app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstructorPublicListView, InstructorAdminViewSet

router = DefaultRouter()
router.register("admin/instructors", InstructorAdminViewSet, basename="admin-instructors")

urlpatterns = [
    path("instructors/", InstructorPublicListView.as_view(), name="instructors-public"),
    path("", include(router.urls)),
]
