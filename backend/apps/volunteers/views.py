"""Views for the volunteers app."""

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import VolunteerApplication
from .serializers import VolunteerApplicationSerializer
from .filters import VolunteerApplicationFilter


class VolunteerCreateView(CreateAPIView):
    """Public POST endpoint to submit a volunteer application."""

    permission_classes = [AllowAny]
    serializer_class = VolunteerApplicationSerializer


class VolunteerAdminViewSet(ModelViewSet):
    """Admin full CRUD for volunteer applications with status filtering."""

    permission_classes = [IsAdminUser]
    serializer_class = VolunteerApplicationSerializer
    filterset_class = VolunteerApplicationFilter
    queryset = VolunteerApplication.objects.all()
