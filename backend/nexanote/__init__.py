# This will make sure the app is always imported when Django starts
from .scheduler import scheduler

__all__ = ['scheduler']

