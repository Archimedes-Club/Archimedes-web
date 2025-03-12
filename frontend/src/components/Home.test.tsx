import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home"; // Ensure the Home component exists at this path
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Home Component", () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test("renders Home component correctly", () => {
    render(<Home />);
    
    // Update the expected heading text to match the rendered component
    expect(
      screen.getByRole("heading", { name: /archimedes club/i })
    ).toBeInTheDocument();
    
    // Check for the login button as well
    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  test("navigates to /login when the login button is clicked", () => {
    render(<Home />);
    
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});