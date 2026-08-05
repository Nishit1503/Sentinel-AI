SAFE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".bmp",
    ".pdf", ".txt", ".doc", ".docx",
    ".xls", ".xlsx",
    ".ppt", ".pptx",
    ".mp3", ".wav",
    ".mp4", ".avi", ".mkv",
    ".zip", ".rar", ".7z"
}

SUSPICIOUS_EXTENSIONS = {
    ".exe",
    ".dll",
    ".jar",
    ".msi"
}

CRITICAL_EXTENSIONS = {
    ".bat",
    ".cmd",
    ".ps1",
    ".vbs",
    ".js",
    ".scr"
}


def analyze_file(extension):

    extension = extension.lower()

    if extension in CRITICAL_EXTENSIONS:
        return {
            "status": "Critical",
            "icon": "🔴"
        }

    if extension in SUSPICIOUS_EXTENSIONS:
        return {
            "status": "Suspicious",
            "icon": "🟡"
        }

    return {
        "status": "Safe",
        "icon": "🟢"
    }