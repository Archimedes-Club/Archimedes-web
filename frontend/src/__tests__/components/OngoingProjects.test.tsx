import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OngoingProjects from "../../components/OngoingProjects";

// Mock react-router-dom
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});

describe("OngoingProjects Component", () => {
  const mockNavigate = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
  });

  test("renders ongoing projects page correctly", () => {
    render(
      <BrowserRouter>
        <OngoingProjects onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
    
    // Check page title
    expect(screen.getByText("Ongoing Projects")).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText("Project Title")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Team Members")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    
    // Check sample projects are rendered
    expect(screen.getByText("AI Research Project")).toBeInTheDocument();
    expect(screen.getByText("Data Mining Study")).toBeInTheDocument();
    expect(screen.getByText("Blockchain Research")).toBeInTheDocument();
    expect(screen.getByText("Machine Learning Analysis")).toBeInTheDocument();
  });

  test("navigates to project detail page when View Project button is clicked", () => {
    render(
      <BrowserRouter>
        <OngoingProjects onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
    
    // Find and click the first View Project button
    const viewButtons = screen.getAllByText("View Project");
    fireEvent.click(viewButtons[0]);
    
    expect(mockNavigate).toHaveBeenCalledWith("/projects/1");
  });

  test("navigates to project detail when project title is clicked", () => {
    render(
      <BrowserRouter>
        <OngoingProjects onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
    
    // Find and click a project title
    const projectTitle = screen.getByText("AI Research Project");
    fireEvent.click(projectTitle);
    
    expect(mockNavigate).toHaveBeenCalledWith("/projects/1");
  });

  test("calls onEdit with correct project when edit button is clicked", () => {
    render(
      <BrowserRouter>
        <OngoingProjects onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
    
    // Find and click the first edit button
    const editButtons = document.querySelectorAll("[data-testid='EditIcon']");
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(expect.objectContaining({
      id: "1",
      title: "AI Research Project",
    }));
  });

  test("calls onDelete with correct project when delete button is clicked", () => {
    render(
      <BrowserRouter>
        <OngoingProjects onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
    
    // Find and click the first delete button
    const deleteButtons = document.querySelectorAll("[data-testid='DeleteIcon']");
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(expect.objectContaining({
      id: "1",
      title: "AI Research Project",
    }));
  });

  test("renders custom projects when provided", () => {
    const customProjects = [
      {
        id: "101",
        title: "Custom Project 1",
        status: "In Progress",
        members: 10,
      },
      {
        id: "102",
        title: "Custom Project 2",
        status: "Completed",
        members: 8,
      },
    ];
    
    render(
      <BrowserRouter>
        <OngoingProjects 
          projects={customProjects} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    );
    
    // Check custom projects are rendered
    expect(screen.getByText("Custom Project 1")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Custom Project 2")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    
    // Sample projects should not be rendered
    expect(screen.queryByText("AI Research Project")).not.toBeInTheDocument();
  });

  test("toggles sidebar visibility when hamburger icon is clicked", () => {
    render(
      <BrowserRouter>
        <OngoingProjects onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
    
    // Initially sidebar should not be visible
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).not.toHaveClass("visible");
    
    // Click hamburger menu
    const hamburgerButton = screen.getByTestId("MenuIcon");
    fireEvent.click(hamburgerButton);
    
    // Sidebar should now be visible
    expect(document.querySelector(".sidebar")).toHaveClass("visible");
  });
});
