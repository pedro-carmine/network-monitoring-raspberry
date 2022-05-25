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

id_pi = socket.gethostname()
user = getpass.getuser()
ping_destination = netifaces.gateways()['default'][netifaces.AF_INET][0]


os.popen(f'ping -c 1 {ping_destination}')  # wakeup ping

process = os.popen(f'ping -c 5 {ping_destination}')
now = datetime.datetime.now()
hour = now.hour
minutes = now.minute
seconds = now.second
ms = now.microsecond

time = f"{hour}:{minutes}:{seconds}.{ms}"

output = process.read()
results = pingparser.parse(output)

max = verify_result(results[MAX_PING])
min = verify_result(results[MIN_PING])
avg = verify_result(results[AVG_PING])

packets_sent = results[SENT]
packets_received = results[RECEIVED]
packet_loss = results[PACKET_LOSS]

connection = None

try:
    connection = psycopg2.connect(f"dbname=testdb user={user}")
    cursor = connection.cursor()
    data = (id_pi, max, min, avg, packets_sent, packets_received, hour)
    sql = f"INSERT INTO facts (id_pi, max, min, avg, packets_sent, packets_received, packet_loss, hour) VALUES ('{id_pi}', '{max}', '{min}', '{avg}', '{packets_sent}', '{packets_received}', '{packet_loss}', '{time}');"
    cursor.execute(sql, data)
    connection.commit()
    print(f"Query successfully executed:\n{sql}")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if connection is not None:
        connection.close()
