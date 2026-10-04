"""URL patterns for the programs app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramPublicListView, ProgramPublicDetailView, ProgramAdminViewSet

router = DefaultRouter()
router.register("admin/programs", ProgramAdminViewSet, basename="admin-programs")

urlpatterns = [
    path("programs/", ProgramPublicListView.as_view(), name="programs-public"),
    path("programs/<int:pk>/", ProgramPublicDetailView.as_view(), name="programs-public-detail"),
    path("", include(router.urls)),
]
