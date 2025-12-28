"""
URL routing for reminders app
"""
from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health, name='health'),
    path('reminders/schedule', views.parse_and_schedule, name='schedule_reminder'),
    path('reminders/list', views.list_reminders, name='list_reminders'),
    path('gemini/info', views.gemini_info, name='gemini_info'),
]

