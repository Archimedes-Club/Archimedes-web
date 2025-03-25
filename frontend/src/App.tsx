import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home"; // Import Home component
import { useAuth } from "./hooks/useAuth"; // Custom hook for authentication
import AllProjects from "./components/AllProjects";
import "./SidebarToggle";
import Registration from "./components/Registration";
import OngoingProjects from "./components/OngoingProjects";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/all-projects"
          element={isAuthenticated ? <AllProjects /> : <Navigate to="/login" />}
        />
        <Route
          path="/ongoingprojects"
          element={
            isAuthenticated ? (
              <OngoingProjects projects={[]} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
