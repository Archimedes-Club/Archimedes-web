import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
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
  logout: jest.fn(),
}));

describe("Sidebar Component", () => {
  const mockNavigate = jest.fn();
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
    
    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      value: { reload: jest.fn() },
      writable: true,
    });
    
    window.alert = jest.fn();
  });

  test("renders collapsed sidebar when isVisible is false", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={false} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toHaveClass("collapsed");
    expect(sidebar).not.toHaveClass("visible");
  });

  test("renders expanded sidebar when isVisible is true", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toHaveClass("visible");
    expect(sidebar).not.toHaveClass("collapsed");
  });

  test("renders sidebar menu items", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    // Check menu items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Ongoing Projects")).toBeInTheDocument();
    expect(screen.getByText("All Projects")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("navigates to dashboard page when Dashboard is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const dashboardItem = screen.getByText("Dashboard").closest("li");
    fireEvent.click(dashboardItem!);
    
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("navigates to ongoing projects page when Ongoing Projects is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const ongoingProjectsItem = screen.getByText("Ongoing Projects").closest("li");
    fireEvent.click(ongoingProjectsItem!);
    
    expect(mockNavigate).toHaveBeenCalledWith("/ongoingprojects");
  });

  test("navigates to all projects page when All Projects is clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const allProjectsItem = screen.getByText("All Projects").closest("li");
    fireEvent.click(allProjectsItem!);
    
    expect(mockNavigate).toHaveBeenCalledWith("/all-projects");
  });

  test("logs out when Logout is clicked", async () => {
    (authServices.logout as jest.Mock).mockResolvedValue({
      message: "Logged out successfully"
    });
    
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const logoutItem = screen.getByText("Logout").closest("li");
    fireEvent.click(logoutItem!);
    
    await waitFor(() => {
      expect(authServices.logout).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Logged out successfully");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test("closes sidebar overlay when clicked", () => {
    render(
      <BrowserRouter>
        <Sidebar isVisible={true} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const overlay = document.querySelector(".sidebar-overlay");
    fireEvent.click(overlay!);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
