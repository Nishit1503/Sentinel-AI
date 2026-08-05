from modules.threat_engine import ThreatEngine
from modules.alerts import add_alert
from database.event_repository import EventRepository


class EventService:

    def __init__(self):
        self.threat_engine = ThreatEngine()

    def process(self, event):

        analysis = self.threat_engine.analyze_file(event)

        event.update(analysis)

        EventRepository.save(event)

        add_alert(event)

        return event

    def search_events(self, keyword):
        return EventRepository.search(keyword)

    def get_all_events(self):
        return EventRepository.get_all()