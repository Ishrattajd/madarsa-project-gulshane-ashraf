"""Views for the contact app."""

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from .filters import ContactMessageFilter


class ContactCreateView(CreateAPIView):
    """Public POST endpoint to submit a contact message."""

    permission_classes = [AllowAny]
    serializer_class = ContactMessageSerializer


class ContactAdminViewSet(ModelViewSet):
    """Admin full CRUD for contact messages with is_read filtering."""

    permission_classes = [IsAdminUser]
    serializer_class = ContactMessageSerializer
    filterset_class = ContactMessageFilter
    queryset = ContactMessage.objects.all()
