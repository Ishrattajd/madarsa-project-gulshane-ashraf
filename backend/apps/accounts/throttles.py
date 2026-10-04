"""
Custom throttle for OTP send endpoint — rate-limits per phone number
rather than per IP so attackers can't bypass it by rotating IPs.
Rate: 5 requests/minute per phone (configured in settings DEFAULT_THROTTLE_RATES).
"""

from rest_framework.throttling import SimpleRateThrottle


class OTPSendThrottle(SimpleRateThrottle):
    """
    Throttles the OTP-send endpoint per phone number.
    Scope 'otp_send' must be present in REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'].
    """

    scope = "otp_send"

    def get_cache_key(self, request, view):
        phone = request.data.get("phone", "")
        if not phone:
            # Fall back to IP-based key if phone is absent (will fail validation anyway)
            return self.cache_format % {
                "scope": self.scope,
                "ident": self.get_ident(request),
            }
        return self.cache_format % {
            "scope": self.scope,
            "ident": phone,
        }
