import "./topbar.css"

const Topbar = () => {
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">PIC Monitoring Hub</span>
                </div>
                <div className="topRight">right</div>
            </div>
        </div>
    );
};

export default Topbar;