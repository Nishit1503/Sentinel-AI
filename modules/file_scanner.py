import os
from modules.file_threat_engine import analyze_file


def format_size(size_bytes):
    """Convert bytes into a readable size."""

    if size_bytes < 1024:
        return f"{size_bytes} B"

    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"

    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

    return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"


def scan_folder(folder_path):
    """
    Recursively scan all files inside a folder.
    Returns a list of file information.
    """

    if not os.path.exists(folder_path):
        raise FileNotFoundError("Folder does not exist.")

    if not os.path.isdir(folder_path):
        raise NotADirectoryError("Provided path is not a folder.")

    scanned_files = []

    for root, dirs, files in os.walk(folder_path):

        for file in files:

            full_path = os.path.join(root, file)

            try:
                size = os.path.getsize(full_path)
            except Exception:
                size = 0

            extension = os.path.splitext(file)[1].lower()

            analysis = analyze_file(extension)

            scanned_files.append({
                "name": file,
                "path": full_path,
                "extension": extension,
                "size_bytes": size,
                "size": format_size(size),
                "status": analysis["status"],
                "icon": analysis["icon"]
            })

    return scanned_files