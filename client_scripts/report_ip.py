from cmath import log
import socket
import psycopg2
from credentials import login

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

hostname = socket.gethostname()
try:
    ip = get_ip_address()
except Exception as e:
    print(f"Check if the device is connected to a network and has an IP address\nError: {e}")

connection = None

try:
    connection = psycopg2.connect(login)
    cursor = connection.cursor()
    data = (ip, hostname)
    sql = f"INSERT INTO current_ip (ip, hostname) VALUES ('{ip}', '{hostname}')"
    cursor.execute(sql, data)
    connection.commit()
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if connection is not None:
        connection.close()