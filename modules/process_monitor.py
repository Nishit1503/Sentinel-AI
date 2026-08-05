import psutil
from modules.threat_engine import analyze_process
from modules.alerts import add_alert

known_processes = set()


def get_new_processes():
    global known_processes

    current = set()
    new_processes = []

    for process in psutil.process_iter(['pid', 'name']):

        try:
            pid = process.info['pid']
            name = process.info['name']

            current.add(pid)

            if pid not in known_processes:

                process_data = {
                    "pid": pid,
                    "name": name
                }

                threat = analyze_process(process_data)

                print(process_data["name"], threat)
                
                if process_data["severity"] in ["MEDIUM", "HIGH", "CRITICAL"]:
                    add_alert(process_data)

                new_processes.append(process_data)

        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess
        ):
            pass

    known_processes = current

    return new_processes

def get_running_processes():

    processes = []

    for process in psutil.process_iter(['pid', 'name']):

        try:

            process_data = {
                "pid": process.info["pid"],
                "name": process.info["name"]
            }

            threat = analyze_process(process_data)

            process_data.update(threat)
            
            if process_data["severity"] in ["MEDIUM", "HIGH", "CRITICAL"]:
                add_alert(process_data)
            processes.append(process_data)

        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess
        ):
            pass

    return processes