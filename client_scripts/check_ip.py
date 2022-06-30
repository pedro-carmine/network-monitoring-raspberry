import socket
import psycopg2
import getpass
from credentials import login
from constants import *


def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

def update_ip(local_cursor, ip):
    print(f"IP changed to: {ip}")
    sql = f"UPDATE raspberry SET ip = '{ip}' WHERE id_pi = '{hostname}'"
    local_cursor.execute(sql)

    # it also updates the main database
    # if any error occurs, the commit is
    # aborted in the local and main database
    connection = psycopg2.connect(login)
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    cursor.close()
    connection.close()

try:
    current_ip = get_ip_address()
except Exception as e:
    print(f"Check if the device is connected to a network and has an IP address\nError: {e}")

connection = None
hostname = socket.gethostname()
user = getpass.getuser()

try:
    connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = connection.cursor()
    sql = f"SELECT ip FROM raspberry WHERE id_pi = '{hostname}'"
    cursor.execute(sql)
    data = cursor.fetchall()
    registered_ip = data[0][0]
    
    if current_ip != registered_ip:
        update_ip(cursor, current_ip)
        connection.commit()
    
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if connection is not None:
        connection.close()