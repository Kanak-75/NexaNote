"""
Gemini Multimodal LLM service for parsing meeting information
"""
import os
import json
import google.generativeai as genai
from django.conf import settings
from .schemas import MeetingReminderSchema


def get_gemini_model():
    """
    Get configured Gemini model instance
    """
    api_key = settings.GEMINI_API_KEY
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured in environment variables")
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    
    # Get model configuration from settings
    model_name = settings.GEMINI_MODEL_NAME
    temperature = settings.GEMINI_TEMPERATURE
    max_tokens = settings.GEMINI_MAX_TOKENS
    
    # Create generation config
    generation_config = {
        "temperature": temperature,
        "max_output_tokens": max_tokens,
    }
    
    # Initialize model with configuration
    model = genai.GenerativeModel(
        model_name=model_name,
        generation_config=generation_config
    )
    
    return model


def parse_meeting_input(user_input: str) -> dict:
    """
    Parse user input (text or link) using Gemini Multimodal LLM
    Returns validated Pydantic JSON schema
    
    Args:
        user_input: Text description or meeting link
        
    Returns:
        dict: Validated meeting data matching MeetingReminderSchema
    """
    # Get configured Gemini model
    model = get_gemini_model()
    
    # Create the prompt with strict JSON schema requirement
    schema = MeetingReminderSchema.model_json_schema()
    
    prompt = f"""You are a meeting information parser. Extract meeting details from the user input (which can be text or a meeting link).

User Input: {user_input}

Extract the following information:
- name: Name/title of the meeting
- time: Scheduled time (convert to ISO 8601 format, assume IST timezone if not specified)
- mode: "online" or "offline" (optional)
- applications: Applications/platforms used like Zoom, Google Meet, Teams, etc. (optional)
- location: Physical location if offline, or URL if online (optional)
- link: Meeting link/URL if available (optional)

IMPORTANT: You MUST return ONLY valid JSON that matches this exact schema:
{json.dumps(schema, indent=2)}

Return ONLY the JSON object, no additional text or markdown formatting."""

    try:
        # Generate content using Gemini model
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join(lines[1:-1]) if lines[-1].strip() == '```' else '\n'.join(lines[1:])
            response_text = response_text.replace('```json', '').replace('```', '').strip()
        
        # Parse JSON
        parsed_data = json.loads(response_text)
        
        # Validate with Pydantic schema
        validated_data = MeetingReminderSchema(**parsed_data)
        
        return validated_data.model_dump()
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON from Gemini response: {e}. Response was: {response_text[:200]}")
    except Exception as e:
        raise ValueError(f"Gemini API error ({settings.GEMINI_MODEL_NAME}): {str(e)}")

