// src/__tests__/components/ProjectTable.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectTable from "../../components/ProjectTable";
import { Project } from "../../types/projects.types";

const sampleProjects: Project[] = [
  {
    id: 1,
    title: "Project One",
    description: "Description for project one",
    category: "Category A",
    team_lead: "Alice",
    status: "Active",
    team_size: 5,
  },
  {
    id: 2,
    title: "Project Two",
    description: "Description for project two",
    category: "Category B",
    team_lead: "Bob",
    status: "Completed",
    team_size: 3,
  },
];

describe("ProjectTable", () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onRowClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ProjectTable
          projects={sampleProjects}
          onEdit={onEdit}
          onDelete={onDelete}
          onRowClick={onRowClick}
        />
      </BrowserRouter>
    );

  test("renders table headers", () => {
    renderComponent();
    expect(screen.getByRole("columnheader", { name: /Project Title/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Description/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Category/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Team Lead/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Team Size/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Actions/i })).toBeInTheDocument();
  });

  test("renders project rows", () => {
    renderComponent();
    sampleProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
      expect(screen.getByText(project.category)).toBeInTheDocument();
      expect(screen.getByText(project.team_lead)).toBeInTheDocument();
      expect(screen.getByText(project.status)).toBeInTheDocument();
      expect(screen.getByText(project.team_size.toString())).toBeInTheDocument();
    });
  });

  test("calls onRowClick when a row is clicked", () => {
    renderComponent();
    const rows = screen.getAllByRole("row");
    // First row is the header; the second row corresponds to the first project.
    fireEvent.click(rows[1]);
    expect(onRowClick).toHaveBeenCalledWith(sampleProjects[0].id);
  });

  test("calls onEdit when edit button is clicked", () => {
    renderComponent();
    const rows = screen.getAllByRole("row");
    const firstRow = rows[1];
    // The first button in the first row is for editing.
    const buttons = firstRow.querySelectorAll("button");
    const editButton = buttons[0];
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(sampleProjects[0]);
  });

  test("calls onDelete when delete button is clicked", () => {
    renderComponent();
    const rows = screen.getAllByRole("row");
    const firstRow = rows[1];
    // The second button in the first row is for deletion.
    const buttons = firstRow.querySelectorAll("button");
    const deleteButton = buttons[1];
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(sampleProjects[0].id);
  });
});
