//code to test login with hardcorded credentials
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Hardcoded credentials for testing
  const validCredentials = {
    username: "admin",
    password: "password123",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if entered credentials match the hardcoded ones
    if (
      username === validCredentials.username &&
      password === validCredentials.password
    ) {
      localStorage.setItem("authToken", "your-auth-token"); // Simulating authentication token storage
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      setError("Invalid username or password"); // Show error message
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Show error if login fails */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
