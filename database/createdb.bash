#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[0;97m'

which psql > /dev/null # omits which command output
if [ $? -ne 0 ]; then
    echo -e "${RED}PostgreSQL not found in the system."
    echo -e "${WHITE}Install it via apt? [y]es [n]o"
    read -rsn1 input
    if [ "$input" = "y" ]; then
        sudo apt install postgresql -y
        echo -e "${GREEN}PostgreSQL installed. Please create a role for the user $USER and run this bash script again."
        exit 0
    else
        echo -e "${RED}Aborting installation. Please install PostgreSQL before running this bash script."
        exit 0
    fi

fi

createdb localdb -O $USER
if [ $? -ne 0 ]; then # either the database is already created or psql service is not running
    exit 1
fi


psql -d localdb -f schema.sql -f view.sql
if [ $? -ne 0 ]; then
    exit 1
fi

pip install -r ../requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}An error occurred when installing pip requirements. Aborting."
    exit 1
fi


python ../client_scripts/register.py
if [ $? -ne 0 ]; then
    echo -e "${RED}An error occurred when registering the device. Aborting."
    exit 1
fi

echo -e "${GREEN}Completed."
exit 0
