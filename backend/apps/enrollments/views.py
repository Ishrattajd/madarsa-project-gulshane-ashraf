"""Views for the enrollments app."""

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import EnrollmentApplication
from .serializers import EnrollmentApplicationSerializer
from .filters import EnrollmentApplicationFilter


class EnrollmentCreateView(CreateAPIView):
    """Public POST endpoint to submit an enrollment application."""

    permission_classes = [AllowAny]
    serializer_class = EnrollmentApplicationSerializer


class EnrollmentAdminViewSet(ModelViewSet):
    """Admin full CRUD for enrollment applications with status filtering."""

    permission_classes = [IsAdminUser]
    serializer_class = EnrollmentApplicationSerializer
    filterset_class = EnrollmentApplicationFilter
    queryset = EnrollmentApplication.objects.select_related("program").all()
