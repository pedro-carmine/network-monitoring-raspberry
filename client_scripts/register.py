from ast import Try
import netifaces
import socket
import getpass
import psycopg2
from constants import LOCAL_DB_NAME

def ask_for_input():
    return input("Do you want to specify the destination ping?\nyes or no?\nIf the answer is no, the ping destination will be the default gateway\nAnswer: ")

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

def validate_ping_destination(specify_destination):
    if (specify_destination.lower() == 'yes'):
        return input("Please insert the address of the destination ping: ").lower()
    elif (specify_destination.lower() == 'no'):
        gateways = netifaces.gateways()
        return gateways['default'][2][0]
    else:
        print("Invalid validation, exiting")
        exit(1)

try:
    ip = get_ip_address()
except Exception as e:
    print(f"Check if the device is connected to a network and has an IP address\nError: {e}")
    
hostname = socket.gethostname()
user = getpass.getuser()
model = input("Raspberry Pi model: ")
location = input("Raspberry Pi location: ")
specify_destination = ask_for_input().lower()

while specify_destination != 'yes' and specify_destination != 'no':
    specify_destination = input("Invalid input, please answer yes or no\nAnswer: ").lower()

destination_ping = validate_ping_destination(specify_destination)
print(destination_ping)

connection = None

try:
    connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = connection.cursor()
    data = (hostname, model)
    sql = f"INSERT INTO raspberry (id_pi, model, location, ip, destination_ping) VALUES ('{hostname}', '{model}', '{location}', '{ip}', '{destination_ping}')"
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