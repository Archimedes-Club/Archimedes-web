import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Sidebar Component", () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders sidebar title and menu items correctly", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // Verify that the sidebar title is rendered
    expect(screen.getByText("Archimedes Portal")).toBeInTheDocument();

    // Verify that all menu items are rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Ongoing Projects")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("All Projects")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to /dashboard when Dashboard is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("navigates to /ongoing-projects when Ongoing Projects is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Ongoing Projects"));
    expect(mockNavigate).toHaveBeenCalledWith("/ongoing-projects");
  });

  test("navigates to /all-projects when All Projects is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("All Projects"));
    expect(mockNavigate).toHaveBeenCalledWith("/all-projects");
  });

  test("navigates to /profile when Profile is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Profile"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("navigates to /logout when Logout is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(mockNavigate).toHaveBeenCalledWith("/logout");
  });
});
