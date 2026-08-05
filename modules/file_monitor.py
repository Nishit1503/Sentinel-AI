from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from datetime import datetime

from modules.hashing import calculate_sha256
from modules.file_classifier import classify
from services.event_service import EventService
import os

event_service = EventService()
# Create Threat Engine instance

# Stores the latest file events
file_events = []


class SentinelFileHandler(FileSystemEventHandler):

    def log_event(self, event_type, path):

        extension = os.path.splitext(path)[1]

        category = classify(extension)

        size = None
        sha256 = None

        # File may not exist if it was deleted
        if os.path.exists(path):
            try:
                size = os.path.getsize(path)
                sha256 = calculate_sha256(path)
            except Exception:
                pass

        # Create event dictionary
        event_data = {
            "time": datetime.now().strftime("%H:%M:%S"),
            "type": event_type,
            "file": os.path.basename(path),
            "path": path,
            "category": category,
            "extension": extension,
            "size": size,
            "sha256": sha256
        }

        # Analyze the event
        event_data = event_service.process(event_data)

        file_events.insert(0, event_data)

        # Keep only latest 100 events
        if len(file_events) > 100:
            file_events.pop()

    def on_created(self, event):
        if not event.is_directory:
            self.log_event("Created", event.src_path)

    def on_modified(self, event):
        if not event.is_directory:
            self.log_event("Modified", event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            self.log_event("Deleted", event.src_path)


observer = Observer()


def start_file_monitor(folder):

    # Create monitored folder if it doesn't exist
    os.makedirs(folder, exist_ok=True)

    handler = SentinelFileHandler()

    observer.schedule(handler, folder, recursive=True)

    observer.start()


def get_file_events():
    return file_events  