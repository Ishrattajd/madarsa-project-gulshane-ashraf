"""
Token helpers for the accounts app.

donor_verification_token — a short-lived JWT (15 min) containing the verified
phone number. Used by the donations flow to confirm the donor owns the phone.
"""

from datetime import datetime, timezone, timedelta

import jwt
from django.conf import settings

_ALGORITHM = "HS256"
_TOKEN_TYPE = "donor_verification"
_LIFETIME_MINUTES = 15


def create_donor_token(phone: str) -> str:
    """
    Issue a signed donor-verification token for the given phone number.
    Expires in 15 minutes.
    """
    now = datetime.now(tz=timezone.utc)
    payload = {
        "type": _TOKEN_TYPE,
        "phone": phone,
        "iat": now,
        "exp": now + timedelta(minutes=_LIFETIME_MINUTES),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=_ALGORITHM)


def decode_donor_token(token: str) -> dict:
    """
    Decode and validate a donor-verification token.
    Raises jwt.ExpiredSignatureError if expired.
    Raises jwt.InvalidTokenError (or subclass) for any other problem.
    Returns the payload dict on success.
    """
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[_ALGORITHM])
    if payload.get("type") != _TOKEN_TYPE:
        raise jwt.InvalidTokenError("Token type mismatch.")
    return payload
