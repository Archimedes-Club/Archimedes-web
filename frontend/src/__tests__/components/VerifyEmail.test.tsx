import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { VerifyEmail } from "../../components/VerifyEmail";
import * as authServices from "../../services/api/authServices";

// Mock react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});

// Mock auth services
jest.mock("../../services/api/authServices", () => ({
  emailVerification: jest.fn(),
  getUser: jest.fn(),
  logout: jest.fn(),
}));

describe("VerifyEmail Component", () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
    
    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      value: { reload: jest.fn() },
      writable: true,
    });
    
    window.alert = jest.fn();
    
    // Mock console.error to prevent noise in test output
    jest.spyOn(console, "error").mockImplementation(() => {});
    
    // Default behavior: user not verified
    (authServices.getUser as jest.Mock).mockRejectedValue(new Error("Not verified"));
  });

  test("renders verification page correctly", () => {
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Verify Your Email Address")).toBeInTheDocument();
    expect(screen.getByText(/verification link has been sent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend Email" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  test("displays sending status when resend button is clicked", async () => {
    (authServices.emailVerification as jest.Mock).mockResolvedValue({
      status: 202
    });
    
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    const resendButton = screen.getByRole("button", { name: "Resend Email" });
    fireEvent.click(resendButton);
    
    expect(screen.getByText("sending verification email...")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Verification email sent ✅")).toBeInTheDocument();
    });
  });

  test("redirects to dashboard when verification succeeds", async () => {
    (authServices.emailVerification as jest.Mock).mockResolvedValue({
      status: 200
    });
    
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    const resendButton = screen.getByRole("button", { name: "Resend Email" });
    fireEvent.click(resendButton);
    
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("logs out user when logout button is clicked", async () => {
    (authServices.logout as jest.Mock).mockResolvedValue({
      message: "Logged out successfully"
    });
    
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    const logoutButton = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(authServices.logout).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Logged out successfully");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("handles error when email verification fails", async () => {
    const error = new Error("Verification failed");
    (authServices.emailVerification as jest.Mock).mockRejectedValue(error);
    
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    const resendButton = screen.getByRole("button", { name: "Resend Email" });
    fireEvent.click(resendButton);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  test("polls for user verification status periodically", async () => {
    jest.useFakeTimers();
    
    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    
    // Initially getUser is called once
    expect(authServices.getUser).toHaveBeenCalledTimes(1);
    
    // After 5 seconds it should be called again
    jest.advanceTimersByTime(5000);
    expect(authServices.getUser).toHaveBeenCalledTimes(2);
    
    // And again after another 5 seconds
    jest.advanceTimersByTime(5000);
    expect(authServices.getUser).toHaveBeenCalledTimes(3);
    
    jest.useRealTimers();
  });
});
