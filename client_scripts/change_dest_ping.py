import psycopg2
import sys
import getpass
import socket
from credentials import login
from constants import *

if len(sys.argv) != 2:
    print("Wrong number of arguments")
    exit(1)

new_destination_ping = sys.argv[1]
user = getpass.getuser()
hostname = socket.gethostname()


try:
    local_connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    main_connection = psycopg2.connect(login)
    local_cursor = local_connection.cursor()
    main_cursor = main_connection.cursor()
    sql = f"UPDATE raspberry SET destination_ping = '{new_destination_ping}' WHERE id_pi = '{hostname}'"
    local_cursor.execute(sql)
    main_cursor.execute(sql)
    local_connection.commit()
    main_connection.commit()
    print(f"New destination ping set to {new_destination_ping}")
    local_cursor.close()
    local_connection.close()
    main_cursor.close()
    main_connection.close()
except Exception as e:
    print(f"An error occurred: {e}")