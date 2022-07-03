import "./data.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import version from "../../version.js";
import { green, red, amber } from "@mui/material/colors";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CableIcon from '@mui/icons-material/Cable';
import SensorsIcon from '@mui/icons-material/Sensors';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

// exported functions that are used in the Home.jsx file too
export function selectInterface(params) {
    if (params.value === 'eth0') { // it only verifies unix interfaces such as eth0 and wlan0
        return <CableIcon />
    }

    else if (params.value === 'wlan0') {
        return <SensorsIcon />
    }

    else {
        return <HelpIcon />
    }
};

export function getChipProps(params) {
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

export const getDate = (params) => {
    let day = params.row.day;
    let month = parseInt(params.row.month) - 1; // in the Date format, month uses index, so we need to subtract 1
    let year = params.row.year;
    return (
        new Date(year, month, day)
    );
};

const Data = () => {

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

    const columns = [
        {field: 'id_pi', headerName: 'Hostname', headerAlign: 'center', width: 85},
        {field: 'location', headerName: 'Location', headerAlign: 'center', width: 70},
        {field: 'max', headerName: 'Max', type: 'number', headerAlign: 'center', width: 65},
        {field: 'min', headerName: 'Min', type: 'number', headerAlign: 'center', width: 65},
        {field: 'avg', headerName: 'Avg', type: 'number', headerAlign: 'center', width: 65},
        {field: 'packets_sent', headerName: 'Sent', type: 'number', headerAlign: 'center', width: 65},
        {field: 'packets_received', headerName: 'Received', type: 'number', headerAlign: 'center', width: 75},
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
        {field: 'interface', headerName: 'Interface', headerAlign: 'center', align: 'center', width: 75, renderCell: (params) => {
            return selectInterface(params)
        }},
        {field: 'connection_status', headerName: 'Connection Status', headerAlign: 'center', align: 'center', width: 170, renderCell: (params) => {
            return <Chip variant="outlined" {... getChipProps(params)}/>
        }}
    ];



    return (
        <div className="data">
            <DataGrid
                rows={data}
                columns={columns}
                id="_id"
                components={{Toolbar: GridToolbar}}
                getRowId={(row) => ((row.id_pi, row.date, row.hour)) }
                />
        </div>
    );
};

export default Data;