// src/__tests__/components/Login.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../components/Login";
import { BrowserRouter } from "react-router-dom";
import { login } from "../../services/api/authServices";

// Mock the login function from authServices
jest.mock("../../services/api/authServices");

// Preserve the original window.location
const originalLocation = window.location;

describe("Login Component", () => {
  beforeAll(() => {
    // Use Object.defineProperty to override window.location.reload
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        ...originalLocation,
        reload: jest.fn(),
      },
    });
  });

  afterAll(() => {
    // Restore the original window.location after all tests
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on window.alert to avoid actual alerts during tests
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders login form correctly", () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Use role 'heading' to get the <h2> element and 'button' for the submit button.
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();

    // Select the email and password inputs by querying the DOM directly
    const emailInput = container.querySelector("input[type='email']");
    const passwordInput = container.querySelector("input[type='password']");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("alerts if email or password is empty on submit", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Click submit without changing anything.
    const submitButton = screen.getByRole("button", { name: /^login$/i });
    fireEvent.submit(submitButton);

    expect(window.alert).toHaveBeenCalledWith("Please enter email and password");
  });

  test("calls login API and handles successful login", async () => {
    // Set up the mock for a successful login response.
    const userMock = { name: "John Doe" };
    (login as jest.Mock).mockResolvedValue({ user: userMock });

    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Select inputs directly using querySelector.
    const emailInput = container.querySelector("input[type='email']") as HTMLInputElement;
    const passwordInput = container.querySelector("input[type='password']") as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /^login$/i });

    // Simulate user entering credentials.
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(submitButton);

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith("john@example.com", "password123")
    );
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Logged in as John Doe")
    );
    expect(window.location.reload).toHaveBeenCalled();
  });

  test("calls login API and handles error", async () => {
    const errorMsg = "Invalid credentials";
    // Mock the login function to reject with an Error instance
    (login as jest.Mock).mockRejectedValue(new Error(errorMsg));
  
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  
    const emailInput = container.querySelector("input[type='email']") as HTMLInputElement;
    const passwordInput = container.querySelector("input[type='password']") as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /^login$/i });
  
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.submit(submitButton);
  
    await waitFor(() =>
      expect(login).toHaveBeenCalledWith("john@example.com", "wrongpassword")
    );
    
    await waitFor(() => {
      // Make sure alert was called at least once
      expect(window.alert).toHaveBeenCalled();
      // Retrieve the first argument passed to window.alert
      const alertArg = (window.alert as jest.Mock).mock.calls[0][0];
      
      // Assert that the argument is an instance of Error and its message contains our expected error
      expect(alertArg).toBeInstanceOf(Error);
      expect(alertArg.message).toContain(errorMsg);
    });
  });
});
