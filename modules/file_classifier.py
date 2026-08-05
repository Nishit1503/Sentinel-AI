FILE_TYPES = {

    ".exe": "Executable",
    ".dll": "Dynamic Library",
    ".bat": "Batch Script",
    ".cmd": "Command Script",
    ".ps1": "PowerShell Script",

    ".txt": "Text Document",
    ".pdf": "PDF Document",
    ".docx": "Word Document",

    ".py": "Python Script",
    ".js": "JavaScript",
    ".html": "HTML",
    ".css": "CSS",

    ".zip": "Archive",
    ".rar": "Archive",
    ".7z": "Archive",

    ".jpg": "Image",
    ".jpeg": "Image",
    ".png": "Image"
}


def classify(extension):

    extension = extension.lower()

    return FILE_TYPES.get(extension, "Unknown")