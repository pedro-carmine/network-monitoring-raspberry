import "./home.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Home = () => {
    const [data, setData]  = useState([]);

    const getData = async () => {
        try {
            const response = await fetch("/data/facts");
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