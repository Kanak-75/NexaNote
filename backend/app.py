import os
import threading
import time
from datetime import datetime
from email.message import EmailMessage
import smtplib
import ssl

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)


def _bool_env(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def send_email(
    sender_email: str,
    sender_password: str,
    receiver_email: str,
    subject: str,
    body: str,
    smtp_host: str = None,
    smtp_port: int | None = None,
    use_ssl: bool | None = None,
    use_starttls: bool | None = None,
    timeout_seconds: int | None = None,
):
    host = smtp_host or os.getenv("SMTP_HOST", "smtp.gmail.com")
    ssl_enabled = use_ssl if use_ssl is not None else _bool_env("SMTP_USE_SSL", True)
    starttls_enabled = (
        use_starttls if use_starttls is not None else _bool_env("SMTP_USE_STARTTLS", False)
    )
    # Defaults: SSL(465) else STARTTLS(587)
    port = smtp_port or (465 if ssl_enabled else 587)
    timeout = int(timeout_seconds or int(os.getenv("SMTP_TIMEOUT_SECONDS", "30")))

    message = EmailMessage()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.set_content(body)

    if ssl_enabled:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(host, port, context=context, timeout=timeout) as server:
            server.login(sender_email, sender_password)
            server.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=timeout) as server:
            if starttls_enabled:
                context = ssl.create_default_context()
                server.starttls(context=context)
            server.login(sender_email, sender_password)
            server.send_message(message)


def schedule_email(run_at: datetime, target_kwargs: dict):
    delay_seconds = max(0, (run_at - datetime.now()).total_seconds())

    def worker():
        try:
            time.sleep(delay_seconds)
            send_email(**target_kwargs)
        except Exception as exc:
            # For a simple demo API, we only log to console
            print(f"Scheduled email failed: {exc}")

    thread = threading.Thread(target=worker, daemon=True)
    thread.start()
    return delay_seconds


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/email/send", methods=["POST"])
def api_send_email():
    data = request.get_json(force=True)

    # Use pre-configured SMTP settings from environment
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")
    receiver_email = data["receiverEmail"]
    subject = data.get("subject", "Reminder from NexaNote")
    body = data.get("body", "")

    if not sender_email or not sender_password:
        return (
            jsonify({
                "error": "SMTP not configured. Please set EMAIL_SENDER and EMAIL_PASSWORD in backend/.env",
            }),
            500,
        )

    if not receiver_email:
        return (
            jsonify({
                "error": "Receiver email is required",
            }),
            400,
        )

    try:
        send_email(
            sender_email=sender_email,
            sender_password=sender_password,
            receiver_email=receiver_email,
            subject=subject,
            body=body,
            smtp_host=os.getenv("SMTP_HOST", "smtp.gmail.com"),
            smtp_port=int(os.getenv("SMTP_PORT", "587")),
            use_ssl=_bool_env("SMTP_USE_SSL", False),
            use_starttls=_bool_env("SMTP_USE_STARTTLS", True),
            timeout_seconds=int(os.getenv("SMTP_TIMEOUT_SECONDS", "30")),
        )
        return jsonify({"status": "sent"})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/email/schedule", methods=["POST"])
def api_schedule_email():
    data = request.get_json(force=True)

    # Use pre-configured SMTP settings from environment
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")
    receiver_email = data["receiverEmail"]
    subject = data.get("subject", "Reminder from NexaNote")
    body = data.get("body", "")
    run_at_iso = data.get("runAtIso")

    if not sender_email or not sender_password:
        return (
            jsonify({
                "error": "SMTP not configured. Please set EMAIL_SENDER and EMAIL_PASSWORD in backend/.env",
            }),
            500,
        )

    if not receiver_email or not run_at_iso:
        return (
            jsonify({
                "error": "Missing required fields: receiverEmail/runAtIso",
            }),
            400,
        )

    try:
        run_at = datetime.fromisoformat(run_at_iso)
    except Exception:
        return jsonify({"error": "runAtIso must be ISO 8601, e.g. 2025-09-19T14:30:00"}), 400

    try:
        delay = schedule_email(
            run_at,
            {
                "sender_email": sender_email,
                "sender_password": sender_password,
                "receiver_email": receiver_email,
                "subject": subject,
                "body": body,
                "smtp_host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
                "smtp_port": int(os.getenv("SMTP_PORT", "587")),
                "use_ssl": _bool_env("SMTP_USE_SSL", False),
                "use_starttls": _bool_env("SMTP_USE_STARTTLS", True),
                "timeout_seconds": int(os.getenv("SMTP_TIMEOUT_SECONDS", "30")),
            },
        )
        return jsonify({"status": "scheduled", "runInSeconds": delay})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))


