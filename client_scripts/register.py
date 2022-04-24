import socket
import getpass
import psycopg2

hostname = socket.gethostname()
user = getpass.getuser()
model = input("Raspberry Pi model: ")

connection = None

try:
    connection = psycopg2.connect(f"dbname=testdb user={user}")
    cursor = connection.cursor()
    data = (hostname, model)
    sql = f"INSERT INTO raspberry (id_pi, model) VALUES ('{hostname}', '{model}')"
    cursor.execute(sql, data)
    connection.commit()
    print(f"Successfully registered with id: {hostname}")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if connection is not None:
        connection.close()