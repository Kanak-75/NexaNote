from django.apps import AppConfig


class RemindersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reminders'
    
    def ready(self):
        # Import scheduler to ensure it starts when Django is ready
        try:
            from nexanote import scheduler
            if not scheduler.running:
                scheduler.start()
        except Exception as e:
            print(f"Warning: Could not start scheduler: {e}")

