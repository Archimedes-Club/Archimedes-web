import React from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import FolderIcon from "@mui/icons-material/Folder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import "../styles/DashboardSidebar.css";
import { logout } from "../services/api/authServices";

export const HamburgerToggle: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => (
  <IconButton
    className="hamburger-menu"
    onClick={toggleSidebar}
    size="large"
    edge="start"
    color="inherit"
    aria-label="menu"
  >
    <MenuIcon />
  </IconButton>
);

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

  const handleLogut = async () => {
    try {
      const response = await logout();
      alert(response.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

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
          {/* <li onClick={() => navigate("/all-projects")}>
            <FolderIcon />
            {isVisible && <span>All Projects</span>}
          </li> */}
          {/* <li>
            <AccountCircleIcon />
            {isVisible && <span>Account</span>}
          </li> */}
          <li onClick={() => navigate("/user-profile")}>
            <PersonIcon />
            {isVisible && <span>Profile</span>}
          </li>
          <li onClick={handleLogut}>
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
