#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[0;97m'

which -s psql
if [ $? -ne 0 ]; then
    echo -e "${RED}PostgreSQL not found in the system."
    echo -e "${WHITE}Install it via apt? [y]es [n]o"
    read -rsn1 input
    if [ "$input" = "y" ]; then
        sudo apt update && sudo apt install postgresql-client-common -y

    else
        echo -e "${RED}Aborting installation. Please install PostgreSQL before running this bash script."
        exit 0
    fi

fi


createdb localdb -O $USER
if [ $? -ne 0 ]; then
    echo -e "${RED}An error occurred when creating the database. Aborting."
    exit 1
fi


psql -d localdb -f schema.sql -f view.sql
if [ $? -ne 0 ]; then
    echo -e "${RED}An error occurred when creating the database schema. Aborting."
    exit 1
fi
pip install -r ../requirements.txt
python ../client_scripts/register.py
echo -e "${GREEN}Completed."
