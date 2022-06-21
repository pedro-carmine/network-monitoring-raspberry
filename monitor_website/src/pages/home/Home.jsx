import "./home.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import version from "../../version.js";
import { green, red, amber } from "@mui/material/colors";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from '@mui/icons-material/Cancel';

const Home = () => {
    const [data, setData]  = useState([]);

    const getData = async () => {
        try {
            const response = await fetch(`/${version}/facts`);
            const jsonData = await response.json();

            setData(jsonData);
        }  catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        getData();
    }, []);

    const getDate = (params) => {
        let day = params.row.day;
        let month = parseInt(params.row.month) - 1; // in the Date format, month uses index, so we need to subtract 1
        let year = params.row.year;
        return (
            new Date(year, month, day)
        );
    };

    function getChipProps(params) {
        if (params.value === 'connected') {
            return {
                icon: <CheckCircleIcon style={{ fill: green[500] }} />,
                label: 'Connected',
                style: {
                    borderColor: green[500]
                }
            };
        }
        else if (params.value === 'no_connection') {
            return {
                icon: <WarningIcon style={{ fill: amber[500] }} />,
                label: 'No Connection',
                style: {
                    borderColor: amber[500]
                }
            };
        }
        else if (params.value === 'disconnected') {
            return {
                icon: <CancelIcon style={{ fill: red[500] }} />,
                label: 'Disconnected',
                style: {
                    borderColor: red[500]
                }
            };
        }
        else {
            return {
                label: 'not defined'
            }
        }
    };

    const columns = [
        {field: 'id_pi', headerName: 'Hostname', headerAlign: 'center', width: 100},
        {field: 'location', headerName: 'Location', headerAlign: 'center', width: 100},
        {field: 'max', headerName: 'Max', type: 'number', headerAlign: 'center', width: 80},
        {field: 'min', headerName: 'Min', type: 'number', headerAlign: 'center', width: 80},
        {field: 'avg', headerName: 'Avg', type: 'number', headerAlign: 'center', width: 80},
        {field: 'packets_sent', headerName: 'Sent', type: 'number', headerAlign: 'center', width: 80},
        {field: 'packets_received', headerName: 'Received', type: 'number', headerAlign: 'center', width: 80},
        {
            field: 'packet_loss', 
            headerName: 'Packet Loss', 
            type: 'number', 
            headerAlign: 'center', 
            width: 120,
            valueFormatter: (params) => {
                return `${params.value} %`;
            }
        },
        {field: 'date', headerName: 'Date', type: 'date', headerAlign: 'center', width: 120, valueGetter: getDate},
        {field: 'hour', headerName: 'Time', headerAlign: 'center', width: 120},
        {field: 'ip', headerName: 'IP Address', headerAlign: 'center', width: 100},
        {field: 'connection_status', headerName: 'Connection Status', headerAlign: 'center', width: 170, renderCell: (params) => {
            return <Chip variant="outlined" {... getChipProps(params)}/>
        }}
    ];



    return (
        <div className="home">
            <DataGrid
                rows={data}
                columns={columns}
                id="_id"
                components={{Toolbar: GridToolbar}}
                getRowId={(row) => (row.id_pi, row.date, row.hour) }
                />
        </div>
    );
};

export default Home;