import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
    }
    try {
      // await getCsrfToken();
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status == 422) {
        throw new Error("Invalid Login Credentials");
      } else if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login Failed");
      }

      const data = await response.json();
      console.log(data);
      // Storin g the token in local storage
      localStorage.setItem("authToken", data.token);

      alert("Logged in as " + data.user.name);
      window.location.reload();
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <div className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
