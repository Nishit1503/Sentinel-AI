import os


def get_folder_suggestions(query):
    """
    Returns matching folders for the given path.
    Example:
        E:\\Do  ->  E:\\Documents, E:\\Downloads
    """

    query = query.strip()

    if not query:
        return []

    parent = os.path.dirname(query)
    partial = os.path.basename(query).lower()

    if parent == "":
        parent = query

    if not os.path.exists(parent):
        return []

    suggestions = []

    try:
        for item in os.listdir(parent):

            full_path = os.path.join(parent, item)

            if os.path.isdir(full_path):

                if item.lower().startswith(partial):
                    suggestions.append(full_path)

    except Exception:
        pass

    return suggestions[:10]