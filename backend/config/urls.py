"""
Root URL configuration.

Routes:
  /admin/                    -> Django admin panel
  /api/token/                -> JWT obtain pair
  /api/token/refresh/        -> JWT refresh
  /api/v1/auth/otp/send/    -> OTP send (phone + purpose)
  /api/v1/auth/otp/verify/  -> OTP verify → JWT or donor token
  /api/v1/                   -> All app-level APIs (versioned)
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # JWT auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Versioned API
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.core.urls")),
    path("api/v1/", include("apps.programs.urls")),
    path("api/v1/", include("apps.instructors.urls")),
    path("api/v1/", include("apps.donations.urls")),
    path("api/v1/", include("apps.enrollments.urls")),
    path("api/v1/", include("apps.events.urls")),
    path("api/v1/", include("apps.gallery.urls")),
    path("api/v1/", include("apps.testimonials.urls")),
    path("api/v1/", include("apps.volunteers.urls")),
    path("api/v1/", include("apps.contact.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
