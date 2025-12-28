"""
Utility functions for Gemini LLM operations
"""
import google.generativeai as genai
from django.conf import settings


def list_available_models():
    """
    List all available Gemini models for the configured API key
    Returns list of model names
    """
    api_key = settings.GEMINI_API_KEY
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured")
    
    genai.configure(api_key=api_key)
    
    try:
        models = genai.list_models()
        gemini_models = [
            model.name for model in models 
            if 'gemini' in model.name.lower() and 'generateContent' in model.supported_generation_methods
        ]
        return gemini_models
    except Exception as e:
        raise ValueError(f"Failed to list Gemini models: {str(e)}")


def get_model_info(model_name: str = None):
    """
    Get information about a specific Gemini model
    
    Args:
        model_name: Name of the model (defaults to configured model)
        
    Returns:
        dict: Model information
    """
    api_key = settings.GEMINI_API_KEY
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured")
    
    genai.configure(api_key=api_key)
    
    model_name = model_name or settings.GEMINI_MODEL_NAME
    
    try:
        model = genai.get_model(model_name)
        return {
            'name': model.name,
            'display_name': model.display_name,
            'description': model.description,
            'input_token_limit': model.input_token_limit,
            'output_token_limit': model.output_token_limit,
            'supported_generation_methods': model.supported_generation_methods,
        }
    except Exception as e:
        raise ValueError(f"Failed to get model info for {model_name}: {str(e)}")

