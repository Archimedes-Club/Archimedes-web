// src/__tests__/components/AllProjects.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AllProjects from "../../components/AllProjects";
import { BrowserRouter } from "react-router-dom";
import * as projectServices from "../../services/api/projectServices";

// Sample projects to simulate API response
const sampleProjects = [
  {
    id: 1,
    title: "Project One",
    description: "Description for project one",
    status: "Active",
    category: "Category A",
    team_lead: "Alice",
    team_size: 5,
  },
  {
    id: 2,
    title: "Project Two",
    description: "Description for project two",
    status: "Completed",
    category: "Category B",
    team_lead: "Bob",
    team_size: 3,
  },
];

// Mock the entire projectServices module
jest.mock("../../services/api/projectServices");

// Also mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("AllProjects Component", () => {
  beforeEach(() => {
    // Simulate getProjects returning sample projects data
    (projectServices.getProjects as jest.Mock).mockResolvedValue({
      data: { data: sampleProjects },
    });
    localStorage.setItem("authToken", "test-token");
    mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders ProjectTable with fetched projects", async () => {
    render(
      <BrowserRouter>
        <AllProjects />
      </BrowserRouter>
    );
    // Wait for the project title to appear
    await waitFor(() => {
      expect(screen.getByText("Project One")).toBeInTheDocument();
    });
    // Verify that each project's title is rendered
    sampleProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  test("navigates to project detail when a row is clicked", async () => {
    render(
      <BrowserRouter>
        <AllProjects />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Project One")).toBeInTheDocument();
    });
    // Find the row containing "Project One"
    const row = screen.getByText("Project One").closest("tr");
    if (row) {
      fireEvent.click(row);
    }
    expect(mockedNavigate).toHaveBeenCalledWith("/projects/1");
  });

  test("opens create project form when 'Create a Project' button is clicked", async () => {
    render(
      <BrowserRouter>
        <AllProjects />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/All Projects/i)).toBeInTheDocument();
    });
    const createButton = screen.getByRole("button", {
      name: /create a project/i,
    });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(screen.getByText(/Dashboard \/ Create Project/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: /Create a New Project/i })).toBeInTheDocument();
  });

  test("navigates to '/all-projects' when 'View More' button is clicked", async () => {
    render(
      <BrowserRouter>
        <AllProjects />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/All Projects/i)).toBeInTheDocument();
    });
    const viewMoreButton = screen.getByRole("button", { name: /view more/i });
    fireEvent.click(viewMoreButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/all-projects");
  });
});
