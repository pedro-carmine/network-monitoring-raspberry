import "./devices.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Devices = () => {
    const [data, setData]  = useState([]);

    const getData = async () => {
        try {
            const response = await fetch("/data/devices");
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
        {field: 'id_pi', headerName: 'ID', headerAlign: 'center', width: 100},
        {field: 'ip', headerName: 'Location', headerAlign: 'center', width: 100},
        {field: 'model', headerName: 'Model', headerAlign: 'center', width: 80},
        {field: 'location', headerName: 'Location', headerAlign: 'center', width: 80},
        {field: 'date', headerName: 'Date', type: 'date', headerAlign: 'center', width: 120, valueGetter: getDate},
        {field: 'hour', headerName: 'Time', type: 'time', headerAlign: 'center', width: 120},
    ];



    return (
        <div className="devices">
            <DataGrid
                rows={data}
                columns={columns}
                id="_id"
                components={{Toolbar: GridToolbar}}
                getRowId={(row) => (row.id_pi, row.ip) }
                />
        </div>
    );
};

export default Devices;