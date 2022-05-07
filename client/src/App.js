import React, { Fragment } from "react";
import './App.css';

//components
import InputId from "./components/InputId";
import ListData from "./components/ListData";
import NavBar from "./components/NavBar";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
    return (
        <div>
            <div className="container">
                <NavBar />
            </div>
            <div className="container">
                <Sidebar />
            </div>
        </div>
    );
};

export default App;
