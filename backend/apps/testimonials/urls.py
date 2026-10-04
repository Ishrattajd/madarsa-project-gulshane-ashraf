"""URL patterns for the testimonials app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestimonialPublicListView, TestimonialAdminViewSet

router = DefaultRouter()
router.register("admin/testimonials", TestimonialAdminViewSet, basename="admin-testimonials")

urlpatterns = [
    path("testimonials/", TestimonialPublicListView.as_view(), name="testimonials-public"),
    path("", include(router.urls)),
]
