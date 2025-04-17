import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectTable from "../../components/ProjectTable";
import { Project } from "../../types/projects.types";

describe("ProjectTable Component", () => {
  const sampleProject: Project = {
    id: 1,
    title: "Test Project",
    description: "Test Description",
    category: "Test Category",
    team_lead: "John Doe",
    status: "Active",
    team_size: 5,
  };

  const sampleProjects: Project[] = [sampleProject];

  let mockOnEdit: jest.Mock;
  let mockOnDelete: jest.Mock;

  beforeEach(() => {
    mockOnEdit = jest.fn();
    mockOnDelete = jest.fn();
  });

  test("renders table headers correctly", () => {
    render(
      <ProjectTable
        projects={sampleProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verify that the table headers are rendered
    expect(screen.getByText("Project Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Team Lead")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Team Size")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("renders project data correctly", () => {
    render(
      <ProjectTable
        projects={sampleProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verify that the project details are rendered in the table
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("calls onEdit with the correct project when edit button is clicked", () => {
    render(
      <ProjectTable
        projects={sampleProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Get all button elements in the row; the first button is for editing.
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(sampleProject);
  });

  test("calls onDelete with the correct id when delete button is clicked", () => {
    render(
      <ProjectTable
        projects={sampleProjects}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Get all button elements in the row; the second button is for deletion.
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(sampleProject.id);
  });

  // Additional test case 1: Handle empty projects array
  test("renders correctly when projects array is empty", () => {
    render(
      <ProjectTable projects={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Verify that table headers are still rendered
    expect(screen.getByText("Project Title")).toBeInTheDocument();

 
    const tbody = document.querySelector("tbody");
    expect(tbody?.children.length).toBe(0);
  });

  //Handle edge-case project data (empty strings or zero values)
  test("renders edge-case project data correctly", () => {
    const edgeProject: Project = {
      id: 2,
      title: "",
      description: "",
      category: "",
      team_lead: "",
      status: "",
      team_size: 0,
    };
    render(
      <ProjectTable
        projects={[edgeProject]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check that a row is rendered (1 header + 1 data row)
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2);

    // Even if fields are empty, the team size should display "0"
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
