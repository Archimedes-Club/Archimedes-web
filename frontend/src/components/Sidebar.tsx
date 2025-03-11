import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>Archimedes Portal</h2>
      <ul>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/ongoing-projects")}>Ongoing Projects</li>
        <li className="sidebar-title">Projects</li>
        <li onClick={() => navigate("/all-projects")}>All Projects</li>
        <li className="sidebar-title">Account</li>
        <li onClick={() => navigate("/profile")}>Profile</li>
        <li onClick={() => navigate("/logout")}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
