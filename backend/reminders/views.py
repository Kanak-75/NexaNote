"""
Django API views for reminder scheduling
"""
import uuid
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
import json as json_lib
import pytz

from .models import Reminder
from .gemini_service import parse_meeting_input
from .email_service import send_reminder_email
from .schemas import MeetingReminderSchema
from nexanote.scheduler import scheduler


@csrf_exempt
@require_http_methods(["POST"])
def parse_and_schedule(request):
    """
    Parse user input (text/link) using Gemini LLM and schedule reminder
    POST /api/reminders/schedule
    Body: {
        "userInput": "text or link",
        "receiverEmail": "user@example.com"
    }
    """
    try:
        data = json_lib.loads(request.body)
        user_input = data.get('userInput', '').strip()
        receiver_email = data.get('receiverEmail', '').strip()
        
        if not user_input:
            return JsonResponse({'error': 'userInput is required'}, status=400)
        
        if not receiver_email:
            return JsonResponse({'error': 'receiverEmail is required'}, status=400)
        
        # Parse using Gemini LLM
        parsed_data = parse_meeting_input(user_input)
        
        # Validate with Pydantic schema
        validated_data = MeetingReminderSchema(**parsed_data)
        validated_dict = validated_data.model_dump()
        
        # Get scheduled time
        scheduled_time = validated_dict['time']
        
        # Ensure timezone-aware datetime
        if isinstance(scheduled_time, str):
            scheduled_time = datetime.fromisoformat(scheduled_time.replace('Z', '+00:00'))
        
        if scheduled_time.tzinfo is None:
            # Assume IST if no timezone
            ist = pytz.timezone('Asia/Kolkata')
            scheduled_time = ist.localize(scheduled_time)
        
        # Create reminder record
        reminder = Reminder.objects.create(
            name=validated_dict['name'],
            scheduled_time=scheduled_time,
            mode=validated_dict.get('mode'),
            applications=validated_dict.get('applications'),
            location=validated_dict.get('location'),
            link=validated_dict.get('link'),
            receiver_email=receiver_email,
            json_data=validated_dict
        )
        
        # Generate unique job ID
        job_id = f"reminder_{reminder.id}_{uuid.uuid4().hex[:8]}"
        reminder.job_id = job_id
        reminder.save()
        
        # Schedule email using APScheduler
        def send_email_job():
            try:
                send_reminder_email(
                    receiver_email=reminder.receiver_email,
                    reminder_name=reminder.name,
                    scheduled_time=reminder.scheduled_time,
                    meeting_link=reminder.link,
                    created_at=reminder.created_at
                )
                reminder.sent = True
                reminder.save()
            except Exception as e:
                print(f"Error sending reminder email for {reminder.id}: {e}")
        
        # Schedule the job
        scheduler.add_job(
            send_email_job,
            'date',
            run_date=scheduled_time,
            id=job_id,
            replace_existing=True
        )
        
        return JsonResponse({
            'status': 'scheduled',
            'reminder': {
                'id': reminder.id,
                'name': reminder.name,
                'scheduledTime': reminder.scheduled_time.isoformat(),
                'createdAt': reminder.created_at.isoformat(),
                'jsonData': reminder.json_data,
            }
        }, status=201)
        
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def list_reminders(request):
    """List all reminders"""
    reminders = Reminder.objects.all()
    return JsonResponse({
        'reminders': [
            {
                'id': r.id,
                'name': r.name,
                'scheduledTime': r.scheduled_time.isoformat(),
                'mode': r.mode,
                'applications': r.applications,
                'location': r.location,
                'link': r.link,
                'receiverEmail': r.receiver_email,
                'createdAt': r.created_at.isoformat(),
                'sent': r.sent,
                'jsonData': r.json_data,
            }
            for r in reminders
        ]
    })


@csrf_exempt
@require_http_methods(["GET"])
def health(request):
    """Health check endpoint"""
    return JsonResponse({'status': 'ok'})


@csrf_exempt
@require_http_methods(["GET"])
def gemini_info(request):
    """Get Gemini model information"""
    try:
        from .gemini_utils import get_model_info
        from django.conf import settings
        
        model_info = get_model_info()
        return JsonResponse({
            'status': 'ok',
            'model': {
                'name': settings.GEMINI_MODEL_NAME,
                'temperature': settings.GEMINI_TEMPERATURE,
                'max_tokens': settings.GEMINI_MAX_TOKENS,
                'info': model_info
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

