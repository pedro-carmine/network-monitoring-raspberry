# Network Monitoring Tool Project for Rasperry Pi

## Installing Python Packages
- If you want to install them outside the bash script in the following section, run the following command:

```bash
pip install -r requirements.txt
```

## Creating the Database

- Make sure postgres service is running on port 5432
- You can edit the script to choose the path of your preference or change the username as your own
- Edit the file ```credentials.py``` located inside the ```client_scripts```folder to configure the main database login
- If all the above requirements are met:

Go inside the `database` folder and run the following commands:

```bash
chmod +x createdb.bash && ./createdb.bash
```

Now the database is created and registered with the Raspberry Pi inside it. To start collecting data, you can set the script located at ```client_scripts/monitor.py``` to run with a crontab job or run it manually.

## Starting the API server

- Make sure you have ```node```installed on your device
- Edit the file ```db.js```inside the ```server_api```folder to configure the main database login
- Go to the ```server_api``` folder and run ```npm install```
- Finally, run ```npm start``` to start the server at port 8080

## Starting the Frontend
- Go to the ```monitor_website``` folder and run ```npm install```
- Finally, run ```npm start``` to start the server at port 3000
- Go to ```localhost:3000``` in your browser to see the web page (if it does not open automatically)

## License
[MIT](https://github.com/pedro-carmine/networking-monitoring-raspberry/blob/main/LICENSE)
