"""Views for the programs app."""

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import Program
from .serializers import ProgramSerializer
from .filters import ProgramFilter


class ProgramPublicListView(ListAPIView):
    """Public list of all active programs."""

    permission_classes = [AllowAny]
    serializer_class = ProgramSerializer
    filterset_class = ProgramFilter
    queryset = Program.objects.filter(is_active=True)


class ProgramPublicDetailView(RetrieveAPIView):
    """Public detail of a single program."""

    permission_classes = [AllowAny]
    serializer_class = ProgramSerializer
    queryset = Program.objects.filter(is_active=True)


class ProgramAdminViewSet(ModelViewSet):
    """Admin full CRUD for programs with filter support."""

    permission_classes = [IsAdminUser]
    serializer_class = ProgramSerializer
    filterset_class = ProgramFilter
    queryset = Program.objects.all()
