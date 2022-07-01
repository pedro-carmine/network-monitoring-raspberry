# Network Monitoring Tool Project for Rasperry Pi

## Installing Python Packages

```bash
pip install -r requirements.txt
```

## Creating the Database

- Make sure postgres service is running on port 5432
- You can edit the script to choose the path of your preference or change the username as your own
- If all the above requirements are met:

Go inside the `database` folder and run the following commands:

```bash
chmod +x createdb.bash
```

```bash
.createdb.bash
```

Now the database is created and registered with the Raspberry Pi inside it. To start collecting data edit the file `client_scripts/monitor.py` to ping the desired IP, then you can set the script to run with a crontab job or run it manually.

## License
[MIT](https://github.com/pedro-carmine/networking-monitoring-raspberry/blob/main/LICENSE)
