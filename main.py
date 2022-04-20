import os
import pingparser

process = os.popen('ping -c 5 192.168.1.1')

output = process.read()

results = pingparser.parse(output)


print(results)
