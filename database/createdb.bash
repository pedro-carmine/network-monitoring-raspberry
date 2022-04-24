#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'

createdb testdb -O $USER
psql -d testdb -f schema.sql
/home/pi/Repos/networking-monitoring-raspberry/.venv/bin/python /home/pi/Repos/networking-monitoring-raspberry/client_scripts/register.py
echo -e "${GREEN}Completed."