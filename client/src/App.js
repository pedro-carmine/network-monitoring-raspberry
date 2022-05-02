import React, { Fragment } from "react";
import './App.css';

//components
import InputId from "./components/InputId";
import ListData from "./components/ListData";

function App() {
    return (
        <Fragment>
            <div className="container">
                <InputId />
                <ListData />
            </div>
        </Fragment>
    )
}

export default App;
