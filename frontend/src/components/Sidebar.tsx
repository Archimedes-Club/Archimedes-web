import React from "react";
import "../App.css";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Archimedes Portal</h2>
      <nav>
        <ul>
          <li className="active">Dashboard</li>
          <li>Ongoing Projects</li>
          <li className="section-title">Projects</li>
          <li>All Projects</li>
          <li className="section-title">Account</li>
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
