import os


class ThreatEngine:

    def analyze_file(self, event):

        score = 0
        reasons = []

        extension = event.get("extension", "").lower()
        path = event.get("path", "").lower()

        dangerous_extensions = {
            ".exe": 25,
            ".bat": 20,
            ".cmd": 20,
            ".ps1": 25,
            ".vbs": 20,
            ".js": 15,
            ".dll": 25
        }

        if extension in dangerous_extensions:
            score += dangerous_extensions[extension]
            reasons.append(f"Dangerous file type ({extension})")

        suspicious_locations = [
            "downloads",
            "temp",
            "appdata",
            "desktop"
        ]

        for location in suspicious_locations:
            if location in path:
                score += 15
                reasons.append(f"Located in {location}")

        event_type = event.get("type", "").lower()

        if event.get("type", "").lower() == "created":
            score += 5
            reasons.append("New file created")

        elif event.get("type", "").lower() == "modified":
            score += 3
            reasons.append("File modified")

        severity = self.get_severity(score)

        return {
            "score": score,
            "severity": severity,
            "reasons": reasons
        }

    def get_severity(self, score):

        if score >= 70:
            return "CRITICAL"
        elif score >= 50:
            return "HIGH"
        elif score >= 25:
            return "MEDIUM"

        return "LOW"


# Create one global ThreatEngine object
threat_engine = ThreatEngine()


# -----------------------------
# File Analysis
# -----------------------------
def analyze_file(event):
    return threat_engine.analyze_file(event)


# -----------------------------
# Process Analysis
# -----------------------------
def analyze_process(process):

    name = process.get("name", "").lower()

    score = 0
    reasons = []

    if name in ["powershell.exe", "pwsh.exe"]:
        score = 95
        reasons.append("PowerShell detected")

    elif name == "cmd.exe":
        score = 70
        reasons.append("Command Prompt detected")

    elif name == "mshta.exe":
        score = 90
        reasons.append("MSHTA detected")

    elif name == "certutil.exe":
        score = 90
        reasons.append("CertUtil detected")

    elif name == "regsvr32.exe":
        score = 85
        reasons.append("Regsvr32 detected")

    elif name in ["python.exe", "java.exe", "node.exe"]:
        score = 25
        reasons.append("Interpreter process")

    elif name in ["chrome.exe", "msedge.exe", "firefox.exe"]:
        score = 5

    elif name in [
        "system",
        "explorer.exe",
        "svchost.exe",
        "services.exe",
        "wininit.exe",
        "lsass.exe",
        "csrss.exe"
    ]:
        score = 0

    else:
        score = 10

    severity = threat_engine.get_severity(score)

    return {
        "score": score,
        "severity": severity,
        "reasons": reasons
    }