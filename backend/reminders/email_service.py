"""
SMTP Email service for sending reminders
"""
import os
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime
from django.conf import settings
from django.utils import timezone
import pytz


def convert_utc_to_ist(utc_datetime: datetime) -> datetime:
    """Convert UTC datetime to IST (Indian Standard Time)"""
    if utc_datetime.tzinfo is None:
        # Assume UTC if no timezone info
        utc_datetime = pytz.UTC.localize(utc_datetime)
    
    ist = pytz.timezone('Asia/Kolkata')
    ist_datetime = utc_datetime.astimezone(ist)
    return ist_datetime


def send_reminder_email(
    receiver_email: str,
    reminder_name: str,
    scheduled_time: datetime,
    meeting_link: str = None,
    created_at: datetime = None
):
    """
    Send email reminder using SMTP
    Format: "You scheduled a reminder [name] at [created_at], it is going to be conducted on [link]"
    """
    sender_email = settings.EMAIL_SENDER
    sender_password = settings.EMAIL_PASSWORD
    
    if not sender_email or not sender_password:
        raise ValueError("Email configuration not set. Please configure EMAIL_SENDER and EMAIL_PASSWORD")
    
    # Convert times to IST for display
    if created_at:
        if created_at.tzinfo is None:
            created_at = timezone.now()
        created_at_ist = convert_utc_to_ist(created_at)
    else:
        created_at_ist = convert_utc_to_ist(timezone.now())
    
    if scheduled_time.tzinfo is None:
        scheduled_time = pytz.UTC.localize(scheduled_time)
    scheduled_time_ist = convert_utc_to_ist(scheduled_time)
    
    # Create email subject - Format: "You scheduled a reminder [name] at [created_at]"
    subject = f"You scheduled a reminder {reminder_name} at {created_at_ist.strftime('%Y-%m-%d %H:%M:%S IST')}"
    
    # Create email body
    body = f"""Hello,

You scheduled a reminder: {reminder_name}

Scheduled Time: {scheduled_time_ist.strftime('%Y-%m-%d %H:%M:%S IST')}
Created At: {created_at_ist.strftime('%Y-%m-%d %H:%M:%S IST')}
"""
    
    if meeting_link:
        body += f"\nIt is going to be conducted on: {meeting_link}\n"
    
    body += "\nThis is an automated reminder from NexaNote."
    
    # Create email message
    message = EmailMessage()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.set_content(body)
    
    # Send email
    host = settings.SMTP_HOST
    port = settings.SMTP_PORT
    use_ssl = settings.SMTP_USE_SSL
    use_starttls = settings.SMTP_USE_STARTTLS
    timeout = settings.SMTP_TIMEOUT_SECONDS
    
    try:
        if use_ssl:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(host, port, context=context, timeout=timeout) as server:
                server.login(sender_email, sender_password)
                server.send_message(message)
        else:
            with smtplib.SMTP(host, port, timeout=timeout) as server:
                if use_starttls:
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                server.login(sender_email, sender_password)
                server.send_message(message)
        
        return True
    except Exception as e:
        raise Exception(f"Failed to send email: {str(e)}")

