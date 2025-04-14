// src/__tests__/components/Registration.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Registration from "../../components/Registration";
import { BrowserRouter } from "react-router-dom";
import { registerUser, login } from "../../services/api/authServices";

jest.mock("../../services/api/authServices");

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Registration Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders registration form correctly", () => {
    const { container } = render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    expect(container.querySelector("input[name='name']")).toBeInTheDocument();
    expect(container.querySelector("input[name='email']")).toBeInTheDocument();
    expect(container.querySelector("input[name='password']")).toBeInTheDocument();
    expect(container.querySelector("input[name='password_confirmation']")).toBeInTheDocument();
    expect(container.querySelector("select[name='role']")).toBeInTheDocument();
  });

  test("shows validation errors when required fields are missing", async () => {
    render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    );

    const registerButton = screen.getByRole("button", { name: /register/i });
    fireEvent.submit(registerButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(screen.getByText("Confirm password is required")).toBeInTheDocument();
      expect(screen.getByText("Role selection is required")).toBeInTheDocument();
    });
  });

  test("handles successful registration", async () => {
    const validFormData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123",
      phone: "1234567890",
      linkedin_url: "https://www.linkedin.com/in/johndoe",
      role: "student",
    };

    (registerUser as jest.Mock).mockResolvedValue(Promise.resolve({}));
    (login as jest.Mock).mockResolvedValue(Promise.resolve({}));

    const { container } = render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    );

    const nameInput = container.querySelector("input[name='name']") as HTMLInputElement;
    const emailInput = container.querySelector("input[name='email']") as HTMLInputElement;
    const passwordInput = container.querySelector("input[name='password']") as HTMLInputElement;
    const confirmPasswordInput = container.querySelector("input[name='password_confirmation']") as HTMLInputElement;
    const phoneInput = container.querySelector("input[name='phone']") as HTMLInputElement;
    const linkedinUrlInput = container.querySelector("input[name='linkedin_url']") as HTMLInputElement;
    const roleSelect = container.querySelector("select[name='role']") as HTMLSelectElement;

    fireEvent.change(nameInput, { target: { value: validFormData.name } });
    fireEvent.change(emailInput, { target: { value: validFormData.email } });
    fireEvent.change(passwordInput, { target: { value: validFormData.password } });
    fireEvent.change(confirmPasswordInput, { target: { value: validFormData.password_confirmation } });
    fireEvent.change(phoneInput, { target: { value: validFormData.phone } });
    fireEvent.change(linkedinUrlInput, { target: { value: validFormData.linkedin_url } });
    fireEvent.change(roleSelect, { target: { value: validFormData.role } });

    const registerButton = screen.getByRole("button", { name: /register/i });
    fireEvent.submit(registerButton);

    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith(JSON.stringify(validFormData))
    );
    await waitFor(() =>
      expect(login).toHaveBeenCalledWith(validFormData.email, validFormData.password)
    );
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Registration successful!")
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/verify-email");
  });

  test("handles registration error", async () => {
    const validFormData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123",
      phone: "1234567890",
      linkedin_url: "https://www.linkedin.com/in/johndoe",
      role: "student",
    };
  
    const errorMessage = "Registration failed";
  
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  
    (registerUser as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
    const { container } = render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    );
  
    const nameInput = container.querySelector("input[name='name']") as HTMLInputElement;
    const emailInput = container.querySelector("input[name='email']") as HTMLInputElement;
    const passwordInput = container.querySelector("input[name='password']") as HTMLInputElement;
    const confirmPasswordInput = container.querySelector("input[name='password_confirmation']") as HTMLInputElement;
    const phoneInput = container.querySelector("input[name='phone']") as HTMLInputElement;
    const linkedinUrlInput = container.querySelector("input[name='linkedin_url']") as HTMLInputElement;
    const roleSelect = container.querySelector("select[name='role']") as HTMLSelectElement;
  
    fireEvent.change(nameInput, { target: { value: validFormData.name } });
    fireEvent.change(emailInput, { target: { value: validFormData.email } });
    fireEvent.change(passwordInput, { target: { value: validFormData.password } });
    fireEvent.change(confirmPasswordInput, { target: { value: validFormData.password_confirmation } });
    fireEvent.change(phoneInput, { target: { value: validFormData.phone } });
    fireEvent.change(linkedinUrlInput, { target: { value: validFormData.linkedin_url } });
    fireEvent.change(roleSelect, { target: { value: validFormData.role } });
  
    const registerButton = screen.getByRole("button", { name: /register/i });
    fireEvent.submit(registerButton);
  
    await waitFor(() => expect(registerUser).toHaveBeenCalled());
  
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      const alertArg = alertSpy.mock.calls[0][0];
      expect(alertArg).toBeInstanceOf(Error);
      expect(alertArg.message).toContain(errorMessage);
    });
  
    alertSpy.mockRestore();
  });
  
});
