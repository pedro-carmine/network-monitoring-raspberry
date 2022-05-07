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
            console.error(err.message());
        }
    };


    useEffect(() => {
        getData();
    }, []);

    const getDate = (params) => {
        return (
            `${params.row.day}/${params.row.month}/${params.row.year}`
        );
    };

    const columns = [
        {field: 'id_pi', headerName: 'ID', width: 70},
        {field: 'max', headerName: 'Max', type: 'number', width: 70},
        {field: 'min', headerName: 'Min', type: 'number', width: 70},
        {field: 'avg', headerName: 'Avg', type: 'number', width: 70},
        {field: 'date', headerName: 'Date', width: 100, valueGetter: getDate, sortable: false},
        {field: 'id_date', headerName: 'SortByDate', width: 130, hidden: 'true'}
    ]



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