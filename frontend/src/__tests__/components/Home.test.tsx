import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ComingSoon from "../../components/Home";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => {
  const originalModule = jest.requireActual("framer-motion");
  return {
    ...originalModule,
    motion: {
      h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
      p: ({ children, ...props }) => <p {...props}>{children}</p>,
      button: ({ children, onClick, ...props }) => (
        <button onClick={onClick} {...props}>
          {children}
        </button>
      ),
    },
  };
});

describe("Home Component", () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test("renders coming soon page correctly", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    expect(screen.getByText("Archimedes Club")).toBeInTheDocument();
    expect(
      screen.getByText(/Something amazing is coming soon/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("navigates to login page when login button is clicked", () => {
    render(
      <BrowserRouter>
        <ComingSoon />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});