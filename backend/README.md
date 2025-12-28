# NexaNote Backend - AI Scheduler & Reminder System

Django backend with AI-powered meeting scheduler and email reminders.

## Features

- **Gemini Multimodal LLM**: Parses meeting text/links to extract structured information
- **Pydantic Validation**: Single source of truth schema for meeting data
- **APScheduler**: Background job scheduling with cron/date triggers
- **SMTP Email**: Automated email reminders with UTC to IST conversion
- **Django REST API**: RESTful endpoints for scheduling reminders

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 2. Configure Environment

Copy `env.example` to `.env` and fill in the values:

```bash
cp env.example .env
```

Required environment variables:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `EMAIL_SENDER`: Your Gmail address
- `EMAIL_PASSWORD`: Gmail App Password (not regular password)
- `SECRET_KEY`: Django secret key (generate a random string)

### 3. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Schedule Reminder
```
POST /api/reminders/schedule
Content-Type: application/json

{
  "userInput": "Team meeting tomorrow at 10 AM on Google Meet",
  "receiverEmail": "user@example.com"
}
```

### List Reminders
```
GET /api/reminders/list
```

## Architecture

```
User Input (text/link)
   ↓
Gemini Multimodal LLM
   ↓
Pydantic JSON Schema (validation)
   ↓
Django Backend (models, views)
   ↓
APScheduler (cron/date trigger)
   ↓
SMTP Email Reminder
```

## Data Flow

1. User provides text or meeting link
2. Gemini LLM extracts: name, time, mode, applications, location, link
3. Pydantic schema validates the extracted data
4. Django creates Reminder model instance
5. APScheduler schedules email job
6. Email sent at scheduled time (converted to IST)

## Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the App Password (not your regular password) in `.env`

## Notes

- All times are converted to IST (Indian Standard Time)
- APScheduler runs in background thread
- Reminders are stored in SQLite database
- Admin panel available at `/admin` (requires superuser)

