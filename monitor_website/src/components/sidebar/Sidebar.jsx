import "./sidebar.css";
import { Home, Devices } from "@material-ui/icons";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem active">
                            <Home className="sidebarIcon"/>
                            Home
                        </li>
                        <li className="sidebarListItem">
                            <Devices className="sidebarIcon" />
                            Devices
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;