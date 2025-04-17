import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api/authServices";
import { useAppContext } from "../context/AppContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {user, setUser} = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
    }
    try {
      const responseData = await login(email, password);
      
      localStorage.setItem("userRole", responseData.user.role); // Store role (professor/student)
      localStorage.setItem("userName", responseData.user.name); // Store user name
      localStorage.setItem("user_id", responseData.user.id);

      setUser({
        id: responseData.user.id,
        name: responseData.user.name,
        email: responseData.user.email,
        linkedInURL: responseData.user.linkedInURL || '',
        phone: responseData.user.phone || '',
        role: responseData.user.role,
      });

      alert("Logged in as " + responseData.user.name);
      // window.location.reload();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      // alert(error);
      setError("Invalid email or password");
      alert("Invalid Email or Password");
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
