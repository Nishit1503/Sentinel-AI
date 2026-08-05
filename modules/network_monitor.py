import psutil


def get_connections():

    connections = []

    for conn in psutil.net_connections(kind="inet"):

        try:

            if conn.raddr:

                process = "Unknown"

                if conn.pid:

                    try:
                        process = psutil.Process(conn.pid).name()
                    except:
                        pass

                connections.append({

                    "process": process,

                    "local_ip": conn.laddr.ip,
                    "local_port": conn.laddr.port,

                    "remote_ip": conn.raddr.ip,
                    "remote_port": conn.raddr.port,

                    "status": conn.status

                })

        except:
            pass

    return connections