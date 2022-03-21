from concurrent.futures import process
import os
import time

process = os.popen('ping -c 3 192.168.1.1')


output = process.read()

t = time.localtime()
current_time = time.strftime("%H:%M:%S", t)

print(f"{output}\n{current_time}")