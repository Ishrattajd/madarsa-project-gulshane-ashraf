"""URL patterns for the enrollments app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentCreateView, EnrollmentAdminViewSet

router = DefaultRouter()
router.register("admin/enrollments", EnrollmentAdminViewSet, basename="admin-enrollments")

urlpatterns = [
    path("enrollments/", EnrollmentCreateView.as_view(), name="enrollments-create"),
    path("", include(router.urls)),
]
