import React from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import FolderIcon from "@mui/icons-material/Folder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import "../styles/DashboardSidebar.css";

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className={`sidebar ${isVisible ? "visible" : "collapsed"}`}>
        {/* <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button> */}
        <ul>
          <li onClick={() => navigate("/dashboard")}>
            <DashboardIcon />
            {isVisible && <span>Dashboard</span>}
          </li>
          <li onClick={() => navigate("/ongoingprojects")}>
            <WorkIcon />
            {isVisible && <span>Ongoing Projects</span>}
          </li>
          <li onClick={() => navigate("/all-projects")}>
            <FolderIcon />
            {isVisible && <span>All Projects</span>}
          </li>
          <li>
            <AccountCircleIcon />
            {isVisible && <span>Account</span>}
          </li>
          <li>
            <PersonIcon />
            {isVisible && <span>Profile</span>}
          </li>
          <li>
            <LogoutIcon />
            {isVisible && <span>Logout</span>}
          </li>
        </ul>
      </div>
      {isVisible && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;
