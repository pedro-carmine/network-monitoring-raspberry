from asyncio import constants
import psycopg2
import socket
import getpass
import datetime
import credentials
from constants import *

hostname = socket.gethostname()
user = getpass.getuser()

connection = None

def id_date_today():
    return datetime.datetime.now().strftime('%Y%m%d')

def register_pi(main_db_cursor):
    print("This device is not registered in the main database\nRegistering...")
    local_connection = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    local_cursor = local_connection.cursor()
    query = f"SELECT * FROM raspberry WHERE id_pi = '{hostname}'"
    local_cursor.execute(query)
    result = local_cursor.fetchall()
    local_connection.close()
    id_pi = result[0][0]
    model = result[0][1]
    location = result[0][2]
    ip = result[0][3]
    destination_ping = result[0][4]
    
    query = f"INSERT INTO raspberry (id_pi, model, location, ip, destination_ping) VALUES ('{id_pi}', '{model}', '{location}', '{ip}', '{destination_ping}')"
    main_db_cursor.execute(query)

def collect_all_data():
    local_conn = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = local_conn.cursor()
    sql = f"SELECT * FROM facts"
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    local_conn.close()
    return result

def collect_pending_data(date, hour):
    local_conn = psycopg2.connect(f"dbname={LOCAL_DB_NAME} user={user}")
    cursor = local_conn.cursor()
    today = id_date_today()
    if today != str(date):
        sql = f"""SELECT * FROM facts 
            WHERE (id_date = {date} AND hour >= '{hour}')
            OR (id_date > {date} AND id_date < {today})
            OR (id_date = {today} AND hour <= '{hour_now()}')
            """
    else:
        sql = f"SELECT * FROM facts WHERE id_date = {date} AND hour >= '{hour}'"
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    local_conn.close()
    return result

def delete_last_updated(cursor):
    sql = f"DELETE FROM last_updated WHERE id_pi = '{hostname}'"
    cursor.execute(sql, hostname)

def hour_now():
    now = datetime.datetime.now()
    hour = now.hour
    minutes = now.minute
    seconds = now.second
    ms = now.microsecond
    return f"{hour}:{minutes}:{seconds}.{ms}"

def check_existence(cursor):
    query = f"SELECT * FROM raspberry WHERE id_pi = '{hostname}'"
    cursor.execute(query, hostname)
    result = cursor.fetchall()
    if len(result) == 0:
        register_pi(cursor)


try:
    connection = psycopg2.connect(credentials.login)
    cursor = connection.cursor()
    check_existence(cursor)
    sql = f"SELECT * FROM last_updated WHERE id_pi = '{hostname}'"
    cursor.execute(sql, hostname)
    result = cursor.fetchall()

    
    if len(result) == 0: # case when the last_updated date and time is not found in the main database
        data_to_be_sent = collect_all_data()
        if data_to_be_sent:
            for data in data_to_be_sent:
                sql = f"INSERT INTO facts (id_pi, id_date, max, min, avg, packets_sent, packets_received, packet_loss, hour, connection_status, interface) VALUES ('{data[0]}', {data[1]}, {data[2]}, {data[3]}, {data[4]}, '{data[5]}', '{data[6]}', '{data[7]}', '{data[8]}', '{data[9]}', '{data[10]}')"
                cursor.execute(sql, data)
            time = hour_now()
            sql_last_updated = f"INSERT INTO last_updated (id_pi, hour) VALUES ('{hostname}', '{time}')"
            cursor.execute(sql_last_updated, (hostname, time))
    else:
        date = result[0][1]
        hour = result[0][2]
        data_to_be_sent = collect_pending_data(date, hour)
        if data_to_be_sent: # if the list is not empty
            for data in data_to_be_sent:
                sql = f"INSERT INTO facts (id_pi, id_date, max, min, avg, packets_sent, packets_received, packet_loss, hour, connection_status, interface) VALUES ('{data[0]}', {data[1]}, {data[2]}, {data[3]}, {data[4]}, '{data[5]}', '{data[6]}', '{data[7]}', '{data[8]}', '{data[9]}', '{data[10]}')"
                cursor.execute(sql, data)
            time = hour_now()
            delete_last_updated(cursor)
            sql_last_updated = f"INSERT INTO last_updated (id_pi, hour) VALUES ('{hostname}', '{time}')"
            cursor.execute(sql_last_updated, (hostname, time))

    connection.commit()
    print("Update committed successfully.")
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if connection is not None:
        connection.close()
