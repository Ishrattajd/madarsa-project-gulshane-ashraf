"""Views for the instructors app."""

from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import Instructor
from .serializers import InstructorPublicSerializer, InstructorAdminSerializer


class InstructorPublicListView(ListAPIView):
    """Public list of active instructors; photo omitted per show_photo flag."""

    permission_classes = [AllowAny]
    serializer_class = InstructorPublicSerializer
    queryset = Instructor.objects.filter(is_active=True)


class InstructorAdminViewSet(ModelViewSet):
    """Admin full CRUD for instructors."""

    permission_classes = [IsAdminUser]
    serializer_class = InstructorAdminSerializer
    queryset = Instructor.objects.all()
