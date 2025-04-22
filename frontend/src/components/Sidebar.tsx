import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import "../styles/DashboardSidebar.css";
import { logout } from "../services/api/authServices";
import { IconButton } from "@mui/material";
import { MenuIcon } from "lucide-react";

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<Boolean>(false);

  const handleLogut = async () => {
    try {
      const response = await logout();
      alert(response.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  function toggleSidebar(): void {
    setIsVisible(!isVisible);
  }

  return (
    <>
      <div className={`sidebar ${isVisible ? "visible" : "collapsed"}`}>
        <ul>
          <li onClick={toggleSidebar}>
            
          {/* <IconButton className="hamburger-menu" onClick={toggleSidebar}> */}
            <MenuIcon />
          </li>
          <li onClick={() => navigate("/dashboard")}>
            <DashboardIcon />
            {isVisible && <span>Dashboard</span>}
          </li>
          <li onClick={() => navigate("/ongoingprojects")}>
            <WorkIcon />
            {isVisible && <span>Ongoing Projects</span>}
          </li>
          <li>
            <PersonIcon />
            {isVisible && <span>Profile</span>}
          </li>
          <li onClick={handleLogut}>
            <LogoutIcon />
            {isVisible && <span>Logout</span>}
          </li>
        </ul>
      </div>
      {isVisible && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
