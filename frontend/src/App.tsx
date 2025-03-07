// import React from "react";
// import Dashboard from "./components/Dashboard";
// import "./App.css"; // Import CSS styles

// const App: React.FC = () => {
//   return <Dashboard />;
// };

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { useAuth } from "./hooks/useAuth"; // Custom hook for authentication

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
