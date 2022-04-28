import psycopg2
import socket
import getpass
import datetime

hostname = socket.gethostname()
user = getpass.getuser()

connection = None

def id_date_today():
    return datetime.datetime.now().strftime('%Y%m%d')

def collect_all_data():
    local_conn = psycopg2.connect(f"dbname=testdb user={user}")
    cursor = local_conn.cursor()
    sql = f"SELECT * FROM facts"
    cursor.execute(sql)
    result = cursor.fetchall()
    cursor.close()
    local_conn.close()
    return result

def collect_pending_data(date, hour):
    local_conn = psycopg2.connect(f"dbname=testdb user={user}")
    cursor = local_conn.cursor()
    today = id_date_today()
    if today == date:
        sql = f"""SELECT * FROM facts 
            WHERE (id_date = {date} AND hour >= '{hour}')
            OR (id_date > {date} AND id_date < {today})
            OR (id_date = {today} AND hour <= '{hour_now()}')
            """
    else:
        sql = f"SELECT * FROM facts WHERE (id_date = {date} AND hour >= '{hour}'"
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

try:
    connection = psycopg2.connect(f"host=192.168.1.247 dbname=testdb")
    cursor = connection.cursor()
    sql = f"SELECT * FROM last_updated WHERE id_pi = '{hostname}'"
    cursor.execute(sql, hostname)
    result = cursor.fetchall()
    if len(result) == 0: # case when the last_updated date and time is not found in the main database
        data_to_be_sent = collect_all_data()
        if data_to_be_sent:
            for data in data_to_be_sent:
                sql = f"INSERT INTO facts (id_pi, id_date, max, min, avg, hour) VALUES ('{data[0]}', {data[1]}, {data[2]}, {data[3]}, {data[4]}, '{data[5]}')"
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
                sql = f"INSERT INTO facts (id_pi, id_date, max, min, avg, hour) VALUES ('{data[0]}', {data[1]}, {data[2]}, {data[3]}, {data[4]}, '{data[5]}')"
                cursor.execute(sql, data)
            time = hour_now()
            delete_last_updated(cursor)
            sql_last_updated = f"INSERT INTO last_updated (id_pi, hour) VALUES ('{hostname}', '{time}')"
            cursor.execute(sql_last_updated, (hostname, time))

    connection.commit()
    cursor.close()
except Exception as e:
    print(f"An error occurred: {e}")

finally:
    if connection is not None:
        connection.close()