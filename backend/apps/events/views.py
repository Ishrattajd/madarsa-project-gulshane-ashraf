"""Views for the events app."""

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import Event, EventImage
from .serializers import EventSerializer, EventImageSerializer
from .filters import EventFilter


class EventPublicListView(ListAPIView):
    """Public list of published events only."""

    permission_classes = [AllowAny]
    serializer_class = EventSerializer
    filterset_class = EventFilter
    queryset = Event.objects.filter(is_published=True).prefetch_related("images")


class EventPublicDetailView(RetrieveAPIView):
    """Public detail of a published event."""

    permission_classes = [AllowAny]
    serializer_class = EventSerializer
    queryset = Event.objects.filter(is_published=True).prefetch_related("images")


class EventAdminViewSet(ModelViewSet):
    """Admin full CRUD for events including unpublished drafts."""

    permission_classes = [IsAdminUser]
    serializer_class = EventSerializer
    filterset_class = EventFilter
    queryset = Event.objects.prefetch_related("images").all()


class EventImageAdminViewSet(ModelViewSet):
    """Admin full CRUD for event gallery images."""

    permission_classes = [IsAdminUser]
    serializer_class = EventImageSerializer
    queryset = EventImage.objects.select_related("event").all()
