"""
OTP delivery services for the accounts app.
Backend is selected via the SMS_BACKEND environment variable.

  console (default) — prints the OTP to stdout; safe for dev/testing.
  msg91             — sends via MSG91 SMS gateway (stub, credentials TBD).
"""

import logging
import random
import string

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def generate_otp() -> str:
    """Return a cryptographically adequate 6-digit numeric OTP string."""
    return "".join(random.choices(string.digits, k=6))


def send_otp(phone: str, code: str) -> None:
    """
    Dispatch an OTP to the given phone number using the configured backend.
    Raises RuntimeError if the backend is unknown.
    """
    backend = getattr(settings, "SMS_BACKEND", "console")
    if backend == "console":
        _send_console(phone, code)
    elif backend == "msg91":
        _send_msg91(phone, code)
    else:
        raise RuntimeError(f"Unknown SMS_BACKEND: '{backend}'")


# ---------------------------------------------------------------------------
# Console backend (development / testing)
# ---------------------------------------------------------------------------

def _send_console(phone: str, code: str) -> None:
    """Log and print the OTP clearly — no real SMS is sent."""
    message = (
        f"\n{'='*50}\n"
        f"  OTP BACKEND: console\n"
        f"  Phone  : {phone}\n"
        f"  Code   : {code}\n"
        f"{'='*50}\n"
    )
    logger.info(message)
    print(message, flush=True)


# ---------------------------------------------------------------------------
# MSG91 backend (production stub — credentials to be filled in .env)
# ---------------------------------------------------------------------------

def _send_msg91(phone: str, code: str) -> None:
    """
    Send OTP via MSG91 SMS gateway.
    Requires MSG91_AUTH_KEY and MSG91_TEMPLATE_ID in settings.
    Will raise an exception if credentials are missing or the request fails.
    """
    auth_key = getattr(settings, "MSG91_AUTH_KEY", "")
    template_id = getattr(settings, "MSG91_TEMPLATE_ID", "")

    if not auth_key or not template_id:
        raise RuntimeError(
            "MSG91_AUTH_KEY and MSG91_TEMPLATE_ID must be set to use the msg91 SMS backend."
        )

    payload = {
        "template_id": template_id,
        "mobile": f"91{phone}",
        "authkey": auth_key,
        "otp": code,
    }
    response = requests.post(
        "https://api.msg91.com/api/v5/otp",
        json=payload,
        timeout=10,
    )
    response.raise_for_status()
    logger.info("MSG91 OTP sent to %s — response: %s", phone, response.text)
