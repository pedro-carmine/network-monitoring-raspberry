import psycopg2
import socket
import getpass

hostname = socket.gethostname()
user = getpass.getuser()

connection = None

try:
    connection = psycopg2.connect(f"dbname=testdb, host=192.168.1.247")
    cursor = connection.cursor()
    sql = f"SELECT * FROM data WHERE id_pi = '{hostname}'"
    cursor.execute(sql, hostname)
    result = cursor.fetchall
    print(result)
except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if connection is not None:
        connection.close()