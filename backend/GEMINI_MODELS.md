# Gemini Model Configuration Guide

## Available Models

NexaNote supports multiple Gemini models. Configure which model to use in your `.env` file.

### Recommended Models

1. **gemini-1.5-flash** (Default)
   - Fastest response time
   - Good for most use cases
   - Lower cost
   - Best for: Quick parsing, simple meetings

2. **gemini-1.5-pro**
   - Most capable model
   - Better accuracy for complex inputs
   - Higher cost
   - Best for: Complex meeting descriptions, multiple meetings in one input

3. **gemini-pro**
   - Legacy model
   - Still supported
   - Best for: Compatibility with older API versions

## Configuration

In your `backend/.env` file:

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (with defaults)
GEMINI_MODEL_NAME=gemini-1.5-flash  # Model to use
GEMINI_TEMPERATURE=0.7              # 0.0 (deterministic) to 1.0 (creative)
GEMINI_MAX_TOKENS=2048              # Maximum response length
```

## Model Parameters

### Temperature
- **0.0 - 0.3**: Very deterministic, consistent outputs
- **0.4 - 0.7**: Balanced (recommended)
- **0.8 - 1.0**: More creative, varied outputs

### Max Tokens
- **512**: Short responses
- **1024**: Medium responses (default for most cases)
- **2048**: Longer, detailed responses (default)
- **4096**: Very detailed responses (for complex inputs)

## Model Comparison

| Model | Speed | Accuracy | Cost | Best For |
|-------|-------|----------|------|----------|
| gemini-1.5-flash | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | Quick parsing, simple meetings |
| gemini-1.5-pro | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | Complex inputs, multiple meetings |
| gemini-pro | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰 | Legacy compatibility |

## Getting Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

## Testing Your Configuration

Check which model is active:

```bash
curl http://localhost:5000/api/gemini/info
```

Response:
```json
{
  "status": "ok",
  "model": {
    "name": "gemini-1.5-flash",
    "temperature": 0.7,
    "max_tokens": 2048,
    "info": {
      "display_name": "Gemini 1.5 Flash",
      "description": "..."
    }
  }
}
```

## Troubleshooting

### Model Not Found Error
- Ensure your API key has access to the model
- Check model name spelling (case-sensitive)
- Verify API key is valid

### Rate Limits
- Free tier: 15 requests per minute
- Consider using `gemini-1.5-flash` for faster, cheaper requests
- Implement retry logic for production

### Response Quality
- Increase `GEMINI_TEMPERATURE` for more creative parsing
- Use `gemini-1.5-pro` for complex inputs
- Increase `GEMINI_MAX_TOKENS` for detailed responses

