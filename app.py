from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import check_password_hash
from config import Config

from modules.process_monitor import get_new_processes, get_running_processes
from modules.alerts import get_alerts
from modules.network_monitor import get_connections
from modules.file_monitor import start_file_monitor
from modules.stats import get_stats
from modules.file_scanner import scan_folder
from modules.folder_suggestions import get_folder_suggestions

from database.database import initialize_database, get_user_by_username
from services.event_service import EventService

import os

app = Flask(__name__)
app.config.from_object(Config)

# Ensure database tables and initial admin account are created
initialize_database()

event_service = EventService()


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("logged_in"):
            if request.path.startswith("/api/") or request.is_json:
                return jsonify({
                    "error": "Unauthorized",
                    "message": "Session expired or authentication required"
                }), 401
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
def home():
    if session.get("logged_in"):
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():

    if session.get("logged_in"):
        return redirect(url_for("dashboard"))

    if request.method == "POST":

        is_json = request.is_json or request.headers.get("X-Requested-With") == "XMLHttpRequest"

        if request.is_json:
            data = request.get_json() or {}
            username = data.get("username", "").strip()
            password = data.get("password", "")
            remember = data.get("remember", False)
        else:
            username = request.form.get("username", "").strip()
            password = request.form.get("password", "")
            remember = request.form.get("remember") == "on"

        user = get_user_by_username(username)

        if user and check_password_hash(user["password_hash"], password):

            session["logged_in"] = True
            session["username"] = user["username"]
            session["user_id"] = user["id"]
            session["role"] = user["role"]

            if remember:
                session.permanent = True

            if is_json:
                return jsonify({
                    "success": True,
                    "redirect": url_for("dashboard"),
                    "message": "Authentication successful!"
                })

            return redirect(url_for("dashboard"))

        else:

            error_msg = "Invalid username or password."

            if is_json:
                return jsonify({
                    "success": False,
                    "error": error_msg
                }), 401

            return render_template("login.html", error=error_msg)

    return render_template("login.html")


@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")


@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))


@app.route("/api/processes")
@login_required
def processes():

    return jsonify(get_running_processes())


@app.route("/api/alerts")
@login_required
def alerts():

    return jsonify(get_alerts())


@app.route("/api/network")
@login_required
def network():

    return jsonify(get_connections())


@app.route("/api/events")
@login_required
def events():

    return jsonify(event_service.get_all_events())


@app.route("/api/events/search")
@login_required
def search_events():

    keyword = request.args.get("q", "").strip()

    if keyword == "":
        return jsonify([])

    return jsonify(event_service.search_events(keyword))


monitor_folder = os.path.join(os.getcwd(), "monitored")

start_file_monitor(monitor_folder)


@app.route("/api/stats")
@login_required
def stats():

    return jsonify(get_stats())


@app.route("/api/scan-folder", methods=["POST"])
@login_required
def scan_folder_api():

    data = request.get_json()

    if not data or "folder" not in data:
        return jsonify({"error": "Folder path is required"}), 400

    folder = data["folder"].strip()

    try:
        files = scan_folder(folder)

        return jsonify({
            "success": True,
            "total_files": len(files),
            "files": files
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route("/api/folder-suggestions")
@login_required
def folder_suggestions():

    query = request.args.get("q", "")

    suggestions = get_folder_suggestions(query)

    return jsonify({
        "success": True,
        "folders": suggestions
    })


if __name__ == "__main__":
    app.run(debug=True)