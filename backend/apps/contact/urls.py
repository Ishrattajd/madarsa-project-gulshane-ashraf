"""URL patterns for the contact app."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactCreateView, ContactAdminViewSet

router = DefaultRouter()
router.register("admin/contact", ContactAdminViewSet, basename="admin-contact")

urlpatterns = [
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
    path("", include(router.urls)),
]
