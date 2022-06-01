import "./devices.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import UpdateIcon from '@mui/icons-material/Update';
import MuiAlert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import version from "../../version.js";


const Devices = () => {
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });


    const [open, setOpen] = useState(false);
    const [data, setData]  = useState([]);
    const [severity, setSeverity] = useState('');


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }


    const getData = async () => {
        try {
            const response = await fetch(`/${version}/devices`);
            const jsonData = await response.json();

            setData(jsonData);
        }  catch (err) {
            console.error(err);
        }
    };

    const monitor = async (ip) => {
        try {
            const response = await fetch(`http://${ip}:8081/monitor`);
            response.status === 200 ? setSeverity('success') : setSeverity('error');
        } catch (err) {
            setSeverity('error');
            console.error(err);
        }
        setOpen(true);
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
        {field: 'ip', headerName: 'IP Address', headerAlign: 'center', width: 100},
        {field: 'model', headerName: 'Model', headerAlign: 'center', width: 80},
        {field: 'location', headerName: 'Location', headerAlign: 'center', width: 80},
        {field: 'date', headerName: 'Date', type: 'date', headerAlign: 'center', width: 120, valueGetter: getDate},
        {field: 'hour', headerName: 'Time', headerAlign: 'center', width: 120},
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Update',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<UpdateIcon />}
                label="Update"
                onClick={ () => monitor(params.row.ip)}
                />
            ]
        },
    ];

    return (
        <div className="devices">
            <DataGrid
                rows={data}
                columns={columns}
                id="_id"
                components={{Toolbar: GridToolbar}}
                getRowId={(row) => (row.id_pi + row.ip) }
            />
            <Snackbar anchorOrigin={{vertical:'top', horizontal:'center'}} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                     Test Alert!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Devices;