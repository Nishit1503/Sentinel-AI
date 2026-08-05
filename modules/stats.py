import psutil

from modules.network_monitor import get_connections
from modules.file_monitor import get_file_events


def get_stats():

    running_processes = len(psutil.pids())

    active_connections = len(get_connections())

    recent_file_events = len(get_file_events())

    suspicious_events = 0

    for event in get_file_events():

        extension = event.get("extension", "").lower()

        if extension in [".exe", ".bat", ".cmd", ".ps1", ".vbs"]:
            suspicious_events += 1

    return {
        "running_processes": running_processes,
        "active_connections": active_connections,
        "recent_file_events": recent_file_events,
        "suspicious_events": suspicious_events
    }