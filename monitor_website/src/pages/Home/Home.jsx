import "./home.css"
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import { green, red, amber } from "@mui/material/colors";
import UpdateIcon from '@mui/icons-material/Update';
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from '@mui/icons-material/Cancel';
import ListIcon from '@mui/icons-material/List';
import MuiAlert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import version from "../../version.js";
import { Button, Chip } from "@mui/material";


const Home = () => {
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });


    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData]  = useState([]);
    const [message, setMessage] = useState('');
    const [showDeviceList, setShowDeviceList] = useState(false);
    const [deviceData, setDeviceData] = useState([]);

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


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleResponse = (status) => {
        if (status === 200) {
            setSeverity('success');
            setMessage('Update request sent');
        }
        else {
            setSeverity('error');
            setMessage('An error occurred');
        }
    };

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
            setLoading(true);
            const response = await fetch(`http://${ip}:8081/monitor`);
            handleResponse(response.status);
        } catch (err) {
            handleResponse(-1);
            console.error(err);
        }
        setLoading(false);
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

    const getDeviceData = async (id) => {
        try {
            const response = await fetch(`/${version}/facts/${id}`);
            const jsonData = await response.json();

            setDeviceData(jsonData);
        }  catch (err) {
            console.error(err);
        }
    };

    const showData = (id) => {
        setShowDeviceList(true);
        getDeviceData(id);
    };

    const columns = [
        {field: 'id_pi', headerName: 'Hostname', headerAlign: 'center', width: 100},
        {field: 'ip', headerName: 'IP Address', headerAlign: 'center', width: 100},
        {field: 'model', headerName: 'Model', headerAlign: 'center', width: 80},
        {field: 'location', headerName: 'Location', headerAlign: 'center', width: 80},
        {field: 'date', headerName: 'Date', type: 'date', headerAlign: 'center', width: 120, valueGetter: getDate},
        {field: 'hour', headerName: 'Time', headerAlign: 'center', width: 120},
        {
            field: 'update',
            type: 'actions',
            headerName: 'Update',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<UpdateIcon />}
                label="Update"
                onClick={ () => monitor(params.row.ip)}
                sx={{color: 'black'}}
                />
            ]
        },
        {
            field: 'list',
            type: 'actions',
            headerName: 'List Data',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<ListIcon />}
                label="List"
                onClick={ () => showData(params.row.id_pi)}
                sx={{color: 'black'}}
                />
            ]
        },
    ];

    const deviceDataColumns = [
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
                getRowId={(row) => (row.id_pi + row.ip) }
            />
            <Snackbar anchorOrigin={{vertical:'top', horizontal:'center'}} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                     {message}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, padding: '30px', verticalAlign: 'middle'}}
                open={showDeviceList}
            >
                <DataGrid
                    rows={deviceData}
                    columns={deviceDataColumns}
                    id="_id"
                    components={{Toolbar: GridToolbar}}
                    getRowId={(row) => ((row.id_pi, row.date, row.hour)) }
                    sx={{backgroundColor: '#fff'}}
                />
                <Button 
                sx={{
                    color: '#000',
                    backgroundColor: '#fff',
                    marginLeft: '5px',
                    marginRight: '5px',
                }}
                variant="Contained" 
                onClick={() => {
                    setShowDeviceList(false)
                    setDeviceData([])
                }
                }>Close</Button>
            </Backdrop>
        </div>
    );
};

export default Home;