from ast import Try
import socket
import getpass
import psycopg2
from constants import LOCAL_DB_NAME

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

hostname = socket.gethostname()
user = getpass.getuser()
model = input("Raspberry Pi model: ")
location = input("Raspberry Pi location: ")

try:
    ip = get_ip_address()
except Exception as e:
    print(f"Check if the device is connected to a network and has an IP address\nError: {e}")

connection = None

try:
    connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = connection.cursor()
    data = (hostname, model)
    sql = f"INSERT INTO raspberry (id_pi, model, location, ip) VALUES ('{hostname}', '{model}', '{location}', '{ip}')"
    cursor.execute(sql, data)
    connection.commit()
    print(f"Successfully registered with id: {hostname}")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")
    exit(1)

finally:
    if connection is not None:
        connection.close()