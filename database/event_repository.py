from database.database import get_connection


class EventRepository:

    @staticmethod
    def save(event):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO file_events
            (
                time,
                event_type,
                file,
                path,
                category,
                extension,
                size,
                sha256,
                severity,
                score
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            event["time"],
            event["type"],
            event["file"],
            event["path"],
            event["category"],
            event["extension"],
            event["size"],
            event["sha256"],
            event["severity"],
            event["score"]
        ))

        conn.commit()
        conn.close()

    @staticmethod
    def search(keyword):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT *
            FROM file_events
            WHERE
                file LIKE ?
                OR extension LIKE ?
                OR category LIKE ?
                OR severity LIKE ?
                OR event_type LIKE ?
            ORDER BY id DESC
        """, (
            f"%{keyword}%",
            f"%{keyword}%",
            f"%{keyword}%",
            f"%{keyword}%",
            f"%{keyword}%"
        ))

        rows = cursor.fetchall()

        conn.close()

        return [dict(row) for row in rows]

    @staticmethod
    def get_all():

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT *
            FROM file_events
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        conn.close()

        return [dict(row) for row in rows]