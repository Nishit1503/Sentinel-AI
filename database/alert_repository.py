from database.database import get_connection


class AlertRepository:

    @staticmethod
    def save(alert):

        print("Saving alert:", alert)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO alerts
            (time, name, type, severity, score, reason)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            alert["time"],
            alert["name"],
            alert["type"],
            alert["severity"],
            alert["score"],
            ", ".join(alert["reason"])
        ))

        conn.commit()
        conn.close()