"""
Production settings — DEBUG=False, enforced security headers.

RAZORPAY_MOCK_MODE HARD GATE
-----------------------------
If RAZORPAY_MOCK_MODE is True and DEBUG is False the process refuses to start.
This is not a soft warning — it raises ImproperlyConfigured so gunicorn/uvicorn
never serves a single request in production with mock payment mode active.
"""

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F401, F403
import environ

env = environ.Env()

DEBUG = False

# Must be explicitly set in production environment
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

# ---------------------------------------------------------------------------
# Hard gate: refuse to start in production with mock payment mode
# ---------------------------------------------------------------------------

if RAZORPAY_MOCK_MODE:  # noqa: F405  — imported via base.*
    raise ImproperlyConfigured(
        "RAZORPAY_MOCK_MODE=True is set but DEBUG=False. "
        "Running mock payment mode in production is forbidden. "
        "Set RAZORPAY_MOCK_MODE=False and configure real Razorpay credentials."
    )

# ---------------------------------------------------------------------------
# Security headers
# ---------------------------------------------------------------------------

SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = "DENY"
