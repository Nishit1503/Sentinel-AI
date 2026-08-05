from datetime import datetime
from database.alert_repository import AlertRepository

alerts = []


def add_alert(data):

    # Ignore LOW severity alerts
    if data.get("severity") == "LOW":
        return

    alert = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "name": data.get("file", data.get("name", "Unknown")),
        "type": "File" if "file" in data else "Process",
        "severity": data.get("severity", "UNKNOWN"),
        "score": data.get("score", 0),
        "reason": data.get("reasons", [])
    }

    # Prevent duplicate alerts
    for existing in alerts:
        if (
            existing["name"] == alert["name"]
            and existing["severity"] == alert["severity"]
            and existing["score"] == alert["score"]
        ):
            return

    # Store alert in memory
    alerts.insert(0, alert)

    # Keep only the latest 100 alerts
    if len(alerts) > 100:
        alerts.pop()

    # Save to SQLite
    AlertRepository.save(alert)


def get_alerts():
    return alerts