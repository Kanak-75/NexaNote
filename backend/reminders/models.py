from django.db import models
from django.utils import timezone


class Reminder(models.Model):
    """Model to store scheduled reminders"""
    name = models.CharField(max_length=255)
    scheduled_time = models.DateTimeField()
    mode = models.CharField(max_length=50, blank=True, null=True)  # online/offline
    applications = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    receiver_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    json_data = models.JSONField(default=dict)  # Store the full Pydantic JSON
    job_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    sent = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.scheduled_time}"

