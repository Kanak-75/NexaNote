"""
Pydantic schema for meeting/reminder validation - Single source of truth
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class MeetingReminderSchema(BaseModel):
    """Strict Pydantic JSON Schema for meeting reminders"""
    name: str = Field(..., description="Name/title of the meeting or reminder")
    time: datetime = Field(..., description="Scheduled time of the meeting in ISO format")
    mode: Optional[str] = Field(None, description="Mode of meeting: 'online' or 'offline'")
    applications: Optional[str] = Field(None, description="Applications/platforms used (e.g., Zoom, Google Meet, Teams)")
    location: Optional[str] = Field(None, description="Location if offline meeting, or URL if online")
    link: Optional[str] = Field(None, description="Meeting link/URL")
    
    @field_validator('mode')
    @classmethod
    def validate_mode(cls, v):
        if v is not None:
            v_lower = v.lower()
            if v_lower not in ['online', 'offline']:
                return None  # Return None if invalid
            return v_lower
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Team Standup",
                "time": "2025-12-18T10:00:00",
                "mode": "online",
                "applications": "Google Meet",
                "location": None,
                "link": "https://meet.google.com/abc-defg-hij"
            }
        }

