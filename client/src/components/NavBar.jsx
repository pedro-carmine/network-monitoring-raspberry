import React from "react";
import "./NavBar.css"

const NavBar = () => {
    return (
        <div className="NavBar">
            <div className="navbarWrapper">
                <div className="topLeft">
                    <span className="logo">NetworkHub</span>
                </div>
                <div className="topRight">right</div>
            </div>
        </div>
    );
};

export default NavBar;