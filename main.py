import os
import pingparser
from collections import OrderedDict

process = os.popen('ping -c 5 192.168.1.1')

output = process.read()

results = pingparser.parse(output)

# get a dictionary from the result
ordered_dict = OrderedDict(results.items())

print(results)
print(ordered_dict['host'])