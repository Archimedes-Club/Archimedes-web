import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../components/Login";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Login Component", () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // Setup a new mock function for each test
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  test("renders login form correctly", () => {
    render(<Login />);
    
    // Check if login heading, input labels, and login button are rendered
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("successful login with correct credentials", async () => {
    render(<Login />);
    
    // Get form fields and button
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    
    // Enter valid credentials (hardcoded as "admin" and "password123")
    fireEvent.change(usernameInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);
    
    // Wait for navigation to be called and assert navigation was performed correctly
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
    
    // Check that localStorage contains the auth token
    expect(localStorage.getItem("authToken")).toBe("your-auth-token");
  });

  test("shows error message with incorrect credentials", async () => {
    render(<Login />);
    
    // Get form fields and button
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    
    // Enter invalid credentials
    fireEvent.change(usernameInput, { target: { value: "wrongUser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
    fireEvent.click(loginButton);
    
    // Assert that the error message is displayed
    const errorMessage = await screen.findByText("Invalid username or password");
    expect(errorMessage).toBeInTheDocument();
    
    // Ensure that navigation is not called and no token is set
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
