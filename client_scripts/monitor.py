#!/home/pi/Repos/networking-monitoring-raspberry/.venv/bin/python
import netifaces
import os
import getpass
import socket
import pingparser
import psycopg2
import datetime
from constants import *


def verify_result(number):
    return 0 if number == 'NaN' else number

def check_status(packet_loss):
    return NO_CONNECTION if packet_loss == '100.0' else CONNECTED

id_pi = socket.gethostname()
user = getpass.getuser()
status = None


try:
    ping_destination = netifaces.gateways()['default'][netifaces.AF_INET][0]
    
    os.popen(f'ping -c 1 {ping_destination}')  # wakeup ping
    process = os.popen(f'ping -c 5 {ping_destination}')

    output = process.read()
    results = pingparser.parse(output)

    max = verify_result(results[MAX_PING])
    min = verify_result(results[MIN_PING])
    avg = verify_result(results[AVG_PING])

    packets_sent = results[SENT]
    packets_received = results[RECEIVED]
    packet_loss = results[PACKET_LOSS]

    status = check_status(packet_loss)
except Exception as e: # when the device is not connected to a network and have no IP, an exception will be thrown
    max = 0
    min = 0
    avg = 0
    packets_sent = 0
    packets_received = 0
    packet_loss = 0
    status = DISCONNECTED

now = datetime.datetime.now()
hour = now.hour
minutes = now.minute
seconds = now.second
ms = now.microsecond

time = f"{hour}:{minutes}:{seconds}.{ms}"

connection = None

try:
    connection = psycopg2.connect(f"dbname=testdb user={user}")
    cursor = connection.cursor()
    data = (id_pi, max, min, avg, packets_sent, packets_received, hour, status)
    sql = f"INSERT INTO facts (id_pi, max, min, avg, packets_sent, packets_received, packet_loss, hour, connection_status) VALUES ('{id_pi}', '{max}', '{min}', '{avg}', '{packets_sent}', '{packets_received}', '{packet_loss}', '{time}', '{status}');"
    cursor.execute(sql, data)
    connection.commit()
    print(f"Query successfully executed:\n{sql}")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if connection is not None:
        connection.close()
