import psycopg2
import sys
import getpass
from constants import *

if len(sys.argv) != 2:
    print("Wrong number of arguments")
    exit(1)

new_destination_ping = sys.argv[1]
user = getpass.getuser()

connection = None
try:
    connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = connection.cursor()
    sql = f"UPDATE raspberry SET destination_ping = '{new_destination_ping}'"
    cursor.execute(sql)
    connection.commit()
    print(f"New destination ping set to {new_destination_ping}")
    cursor.close()
    connection.close()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if connection is not None:
        connection.close()
