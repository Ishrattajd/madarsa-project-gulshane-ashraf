"""Views for the testimonials app."""

from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialPublicListView(ListAPIView):
    """Public list of approved testimonials only."""

    permission_classes = [AllowAny]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.filter(is_approved=True)


class TestimonialAdminViewSet(ModelViewSet):
    """Admin full CRUD for testimonials including unapproved ones."""

    permission_classes = [IsAdminUser]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.all()
