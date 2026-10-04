"""
Payment services for the donations app.
Keeps Razorpay business logic out of serializers and views.

MOCK MODE
---------
When RAZORPAY_MOCK_MODE=True the service skips real API calls and returns
deterministic stub data.  This is hard-gated: production settings refuse to
start the Django process if mock mode is enabled (see config/settings/prod.py).
A visible banner is shown on /donate in the frontend whenever mock mode is on.
"""

import hashlib
import hmac
import uuid

import razorpay
from django.conf import settings


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _keys_configured() -> bool:
    """Return True only when both Razorpay credentials are non-empty strings."""
    return bool(
        getattr(settings, "RAZORPAY_KEY_ID", "").strip()
        and getattr(settings, "RAZORPAY_KEY_SECRET", "").strip()
    )


def _assert_keys_or_mock():
    """
    Raise ImproperlyConfigured if neither real keys nor mock mode are active.
    Prevents silent failures where HMAC runs with an empty key.
    """
    from django.core.exceptions import ImproperlyConfigured

    if not _keys_configured() and not getattr(settings, "RAZORPAY_MOCK_MODE", False):
        raise ImproperlyConfigured(
            "Razorpay credentials are not set and RAZORPAY_MOCK_MODE is False. "
            "Either add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET to .env, "
            "or set RAZORPAY_MOCK_MODE=True for local development."
        )


def get_razorpay_client():
    """Return an authenticated Razorpay client."""
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


# ---------------------------------------------------------------------------
# Order creation
# ---------------------------------------------------------------------------

def create_razorpay_order(amount_inr: float, currency: str = "INR") -> dict:
    """
    Create a Razorpay order for the given amount (in INR; converted to paise).
    Returns the Razorpay order dict.

    In MOCK MODE returns a stub dict so the frontend checkout flow can be
    exercised end-to-end without hitting the real gateway.
    """
    _assert_keys_or_mock()

    if getattr(settings, "RAZORPAY_MOCK_MODE", False):
        mock_id = f"order_MOCK_{uuid.uuid4().hex[:12].upper()}"
        return {
            "id": mock_id,
            "amount": int(amount_inr * 100),
            "currency": currency,
            "status": "created",
            "_mock": True,
        }

    client = get_razorpay_client()
    amount_paise = int(amount_inr * 100)
    return client.order.create(
        data={"amount": amount_paise, "currency": currency, "payment_capture": 1}
    )


# ---------------------------------------------------------------------------
# Signature verification — PAYMENT SECURITY CODE
# ---------------------------------------------------------------------------

def verify_razorpay_signature(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> bool:
    """
    Verify the Razorpay HMAC-SHA256 payment signature server-side.
    Returns True only when the signature is genuine.

    Bug fixes applied vs original implementation
    ---------------------------------------------
    Bug 1 — Empty-key bypass (critical):
        The original code called hmac.new() even when RAZORPAY_KEY_SECRET=""
        (the default in .env).  An HMAC computed with an empty key is trivially
        reproducible by any attacker who knows the order_id and payment_id.
        Fix: refuse to verify if the secret is blank; return False immediately.

    Bug 2 — hmac.new() removed in Python 3.13:
        hmac.new() is a deprecated factory function removed in Python 3.13.
        Django 6.x targets Python 3.12+, and Python 3.13 is already GA.
        Fix: use hmac.digest() (available since 3.7), which is a single-pass
        C-level call with no deprecated API and no object allocation overhead.

    MOCK MODE:
        Mock order IDs start with 'order_MOCK_'. Verifying them always returns
        True so the frontend UI flow completes without a real signature.
    """
    # --- Mock mode fast-path ---
    if getattr(settings, "RAZORPAY_MOCK_MODE", False) and razorpay_order_id.startswith("order_MOCK_"):
        return True

    # --- Bug 1 guard: refuse to run with a blank secret ---
    key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "").strip()
    if not key_secret:
        # Log and return False rather than raising so the view returns 400
        import logging
        logging.getLogger(__name__).error(
            "verify_razorpay_signature called with blank RAZORPAY_KEY_SECRET — "
            "returning False to prevent empty-key bypass."
        )
        return False

    # --- Bug 2 fix: hmac.digest() instead of deprecated hmac.new() ---
    key_bytes = key_secret.encode("utf-8")
    message = f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8")
    expected = hmac.digest(key_bytes, message, hashlib.sha256).hex()

    return hmac.compare_digest(expected, razorpay_signature)
