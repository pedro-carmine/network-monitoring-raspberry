import "./home.css"
import version from "../../version.js";
import { selectInterface, getChipProps, getDate } from "../data/Data";
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import TextField from '@mui/material/TextField';
import UpdateIcon from '@mui/icons-material/Update';
import ListIcon from '@mui/icons-material/List';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import MuiAlert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Chip, Paper } from "@mui/material";


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

    const [showInputPage, setShowInputPage] = useState(false);
    const [dest, setDest] = useState('');
    const [targetIP, setTargetIP] = useState('');


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleInput = (event) => {
        setDest(event.target.value);
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

    const changeDestPing = (targetIP) => {
        setTargetIP(targetIP);
        setShowInputPage(true);
    }

    const sendUpdateDestinationRequest = async (new_dest) => {
        try{
            setShowInputPage(false);
            setLoading(true);
            const response = await fetch(`http://${targetIP}:8081/destination_ping/${new_dest}`);
            handleResponse(response.status);
        } catch (err) {
            handleResponse(-1);
            console.error(err);
        }
        setLoading(false);
        setOpen(true);
    };


    const columns = [
        {field: 'id_pi', headerName: 'Hostname', headerAlign: 'center', width: 100},
        {field: 'ip', headerName: 'IP Address', headerAlign: 'center', width: 100},
        {field: 'model', headerName: 'Model', headerAlign: 'center', width: 80},
        {field: 'location', headerName: 'Location', headerAlign: 'center', width: 80},
        {field: 'date', headerName: 'Date', type: 'date', headerAlign: 'center', width: 120, valueGetter: getDate},
        {field: 'hour', headerName: 'Time', headerAlign: 'center', width: 120},
        {field: 'destination_ping', headerName: 'Dest. Address', headerAlign: 'center', align: 'center', maxWidth: 200, flex: 1},
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
        {
            field: 'update_dest_ping',
            type: 'actions',
            headerName: 'Set Dest. Address',
            width: 180,
            getActions: (params) => [
                <GridActionsCellItem
                icon={<GpsFixedIcon />}
                label="Destination"
                onClick={ () => changeDestPing(params.row.ip) }
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
        {field: 'interface', headerName: 'Interface', headerAlign: 'center', align: 'center', width: 75, renderCell: (params) => {
            return selectInterface(params)
        }},
        {field: 'connection_status', headerName: 'Connection Status', headerAlign: 'center', width: 180, renderCell: (params) => {
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
            <Backdrop // backdrop for the update button
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Backdrop // backdrop for the device datagrid
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
            <Backdrop
                open={showInputPage}
            >
                <Paper elevation={24} sx={{padding: '16px'}}>
                    <TextField 
                    id="outlined-required" 
                    label="New Destination Address"
                    value={dest}
                    onChange={handleInput}
                    sx={{padding: '10px'}}
                    />
                    <div>
                        <Button
                            onClick={() => {
                                sendUpdateDestinationRequest(dest);
                            }}
                        >
                        Update</Button>
                        <Button
                            onClick={() => {
                                setShowInputPage(false);
                            }}
                        >Cancel</Button>
                    </div>
                </Paper>
            </Backdrop>
        </div>
    );
};

export default Home;