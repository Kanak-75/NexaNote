# NexaNote - AI Scheduler Setup Guide

## Quick Start

### Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

5. **Required Environment Variables:**
   - `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - `EMAIL_SENDER`: Your Gmail address
   - `EMAIL_PASSWORD`: Gmail App Password (generate from [Google Account](https://myaccount.google.com/apppasswords))
   - `SECRET_KEY`: Django secret key (any random string)

6. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React/TypeScript)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Using the AI Scheduler

1. Navigate to **"AI Scheduler"** in the sidebar
2. Enter your email address
3. Paste a meeting link or describe your meeting:
   - Example: `https://meet.google.com/abc-defg-hij`
   - Example: `Team standup meeting tomorrow at 10 AM on Zoom`
   - Example: `Client meeting on Dec 20, 2025 at 2:30 PM at Office Building`
4. Click **"Parse & Schedule Reminder"**
5. The AI will extract meeting details and schedule an email reminder

## Features

- ✅ **Gemini Multimodal LLM**: Automatically parses meeting text/links
- ✅ **Pydantic Validation**: Ensures data consistency
- ✅ **APScheduler**: Background job scheduling
- ✅ **SMTP Email**: Automated reminders
- ✅ **UTC to IST**: Automatic timezone conversion
- ✅ **Django Admin**: Manage reminders at `/admin`

## Architecture

```
User Input (text/link)
   ↓
Gemini Multimodal LLM
   ↓
Strict Pydantic JSON Schema (single source of truth)
   ↓
Django Backend
   ↓
APScheduler (Cron / Date trigger)
   ↓
SMTP Email Reminder
```

## Troubleshooting

### Gemini API Error
- Ensure `GEMINI_API_KEY` is set in `.env`
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Enable 2-Factor Authentication on Gmail
- Check SMTP settings in `.env`

### Scheduler Not Working
- Ensure Django server is running
- Check APScheduler logs in console
- Verify timezone settings (IST)

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/reminders/schedule` - Schedule a reminder
- `GET /api/reminders/list` - List all reminders

