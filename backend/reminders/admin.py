from django.contrib import admin
from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['name', 'scheduled_time', 'receiver_email', 'sent', 'created_at']
    list_filter = ['sent', 'mode', 'created_at']
    search_fields = ['name', 'receiver_email']
    readonly_fields = ['created_at', 'json_data']

