"""
Development settings — DEBUG=True, relaxed security.
"""

from .base import *  # noqa: F401, F403

DEBUG = True

# Allow all hosts locally
ALLOWED_HOSTS = ["*"]
