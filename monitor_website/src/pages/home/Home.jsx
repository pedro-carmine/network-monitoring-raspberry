import "./home.css"
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const Home = () => {
    const [data, setData]  = useState([]);

    const getData = async () => {
        try {
            const response = await fetch("/data");
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
        {field: 'id_pi', headerName: 'ID', headerAlign: 'center', width: 70},
        {field: 'max', headerName: 'Max', type: 'number', headerAlign: 'center', width: 70},
        {field: 'min', headerName: 'Min', type: 'number', headerAlign: 'center', width: 70},
        {field: 'avg', headerName: 'Avg', type: 'number', headerAlign: 'center', width: 70},
        {field: 'date', headerName: 'Date', type: 'date', headerAlign: 'center', width: 120, valueGetter: getDate}
    ];



    return (
        <div className="home">
            <DataGrid
                rows={data}
                columns={columns}
                id="_id"
                getRowId={(row) => (row.id_pi, row.date, row.hour) }
                />
        </div>
    );
};

export default Home;