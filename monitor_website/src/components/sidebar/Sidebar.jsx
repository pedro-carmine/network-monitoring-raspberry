import "./sidebar.css";
import { Home } from "@material-ui/icons";
import { TableView } from "@mui/icons-material"
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarListItem">
                                <Home className="sidebarIcon"/>
                                Home
                            </li>
                        </Link>
                        <Link to="/devices" className="link">
                            <li className="sidebarListItem">
                                <TableView className="sidebarIcon" />
                                Data List
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;