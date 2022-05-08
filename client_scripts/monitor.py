#!/home/pi/Repos/networking-monitoring-raspberry/.venv/bin/python

import os
import getpass
import socket
import pingparser
import psycopg2
import datetime
from constants import *

id_pi = socket.gethostname()
user = getpass.getuser()

os.popen('ping -c 1 192.168.1.1')  # wakeup ping

process = os.popen('ping -c 5 192.168.1.1')
now = datetime.datetime.now()
hour = now.hour
minutes = now.minute
seconds = now.second
ms = now.microsecond

time = f"{hour}:{minutes}:{seconds}.{ms}"

output = process.read()
results = pingparser.parse(output)

max = results[MAX_PING]
min = results[MIN_PING]
avg = results[AVG_PING]
packets_sent = results[SENT]
packets_received = results[RECEIVED]

connection = None

try:
    connection = psycopg2.connect(f"dbname=testdb user={user}")
    cursor = connection.cursor()
    data = (id_pi, max, min, avg, hour)
    sql = f"INSERT INTO facts (id_pi, max, min, avg, hour) VALUES ('{id_pi}', {max}, {min}, {avg}, '{time}');"
    cursor.execute(sql, data)
    connection.commit()
    print(f"Query successfully executed:\n{sql}")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if connection is not None:
        connection.close()
