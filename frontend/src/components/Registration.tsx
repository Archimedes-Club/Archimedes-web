import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Registration.css";
import { login, registerUser } from "../services/api/authServices";
import { AxiosResponse } from "axios";

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    linkedin_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [submitDisable, setSubDisable] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.password_confirmation.trim())
      newErrors.confirmPassword = "Confirm password is required";

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password match validation
    if (
      formData.password &&
      formData.password_confirmation &&
      formData.password !== formData.password_confirmation
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // LinkedIn URL format validation (optional)
    if (
      formData.linkedin_url &&
      !formData.linkedin_url.includes("linkedin.com")
    ) {
      newErrors.linkedin_url = "Please enter a valid LinkedIn URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setSubDisable(true);
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response: AxiosResponse | undefined = await registerUser(
        JSON.stringify(formData)
      );

      // const data = await response;
      localStorage.setItem("userRole", response?.data.role); // Store role (professor/student)
      
      alert("Registration successful!");

      await login(formData.email, formData.password);

      
      navigate("/verify-email");
    } catch (error) {
      console.error("Error registering:", error);
      alert(error);
    }finally{
      setSubDisable(false);
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Name <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>
            Email <span className="required-asterisk">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>
            Password <span className="required-asterisk">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        <div className="form-group">
          <label>
            Confirm Password <span className="required-asterisk">*</span>
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
          />
          {errors.linkedin_url && (
            <p className="error-message">{errors.linkedin_url}</p>
          )}
        </div>

        <button disabled={submitDisable}  type="submit">Register</button>
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default Registration;