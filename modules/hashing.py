import hashlib


def calculate_sha256(file_path):

    sha = hashlib.sha256()

    try:
        with open(file_path, "rb") as f:

            while True:
                chunk = f.read(4096)

                if not chunk:
                    break

                sha.update(chunk)

        return sha.hexdigest()

    except Exception:
        return None