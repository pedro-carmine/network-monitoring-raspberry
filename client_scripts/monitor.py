import netifaces
import getpass
import socket
import pingparsing
import psycopg2
import datetime
from constants import *

ping_parser = pingparsing.PingParsing()
transmitter = pingparsing.PingTransmitter()

def verify_result(number):
    return 0 if number == None else number

def check_status(packet_loss):
    return NO_CONNECTION if packet_loss == '100' else CONNECTED

def get_time():
    now = datetime.datetime.now()
    hour = now.hour
    minutes = now.minute
    seconds = now.second
    ms = now.microsecond
    return f"{hour}:{minutes}:{seconds}.{ms}"

id_pi = socket.gethostname()
user = getpass.getuser()
status = None

time = get_time()

try:
    gateways = netifaces.gateways()
    ping_destination = gateways['default'][netifaces.AF_INET][0]
    interface = gateways['default'][netifaces.AF_INET][1]
    
    transmitter.destionation = ping_destination
    result = transmitter.ping()
    dict = ping_parser.parse(result).as_dict()

    max = verify_result(dict[MAX_PING])
    min = verify_result(dict[MIN_PING])
    avg = verify_result(dict[AVG_PING])

    packets_sent = dict[SENT]
    packets_received = dict[RECEIVED]
    packet_loss = dict[PACKET_LOSS]

    status = check_status(packet_loss)
    print("DEBUG: Status of the first ping= " + status)
    print(status == NO_CONNECTION)
    print(len(gateways) == 2)
    if status == NO_CONNECTION and len(gateways) == 2: # try pinging with the wireless interface
        print("DEBUG: TRYING ANOTHER INTERFACE")
        interface = gateways[2][1][1]
        ping_destination = gateways[2][1][0]
        print(interface, ping_destination)
        # os.popen(f'ping -c 1 -I {interface} {ping_destination}')
        # os.popen(f'ping -c 5 -I {interface} {ping_destination}')

        # output = process.read()
        # results = pingparser.parse(output)
        # max = verify_result(results[MAX_PING])
        # min = verify_result(results[MIN_PING])
        # avg = verify_result(results[AVG_PING])

        # packets_sent = results[SENT]
        # packets_received = results[RECEIVED]
        # packet_loss = results[PACKET_LOSS]

        status = check_status(packet_loss)
except Exception as e: # when the device is not connected to a network and have no IP, an exception will be throw
    max = 0
    min = 0
    avg = 0
    packets_sent = 0
    packets_received = 0
    packet_loss = 0
    status = DISCONNECTED

connection = None

try:
    connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = connection.cursor()
    sql = f"INSERT INTO facts (id_pi, max, min, avg, packets_sent, packets_received, packet_loss, hour, connection_status, interface) VALUES ('{id_pi}', '{max}', '{min}', '{avg}', '{packets_sent}', '{packets_received}', '{packet_loss}', '{time}', '{status}', '{interface}');"
    cursor.execute(sql)
    connection.commit()
    print(f"Query successfully executed:\n{sql}")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if connection is not None:
        connection.close()
