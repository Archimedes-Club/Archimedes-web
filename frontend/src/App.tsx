import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home"; // Import Home component
// import AllProjects from "./components/AllProjects";
import "./SidebarToggle";
import Registration from "./components/Registration";
import OngoingProjects from "./components/OngoingProjects";
import { useAuth } from "./hooks/useAuth";
import { VerifyEmail } from "./components/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";
import ProjectDetail from "./components/ProjectDetail";
import UserProfile from "./components/UserProfile";

const App: React.FC = () => {
  useEffect(()=>{
    document.title = "Archimedes Club"; 
  },[])
  return (
    <Router basename="/archimedes">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/all-projects"
          element={
            <ProtectedRoute>
              <AllProjects/>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/ongoingprojects"
          element={
            <ProtectedRoute>
              <OngoingProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <ProtectedRoute requireVerified={false}>
              <VerifyEmail />
            </ProtectedRoute>
          }
        />
        <Route path="/user-profile" element={<UserProfile />} />{" "}
        {/* Profile page route */}
      </Routes>
    </Router>
  );
};

interface Props {
  children: React.ReactNode;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default App;
