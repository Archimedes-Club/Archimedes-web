// src/__tests__/components/Dashboard.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../../components/Dashboard";
import { BrowserRouter } from "react-router-dom";

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

// Provide a global mock for useNavigate.
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn((url: string, options?: RequestInit) => {
      // Mock GET: fetching projects.
      if (url.includes("/api/v1/projects") && options?.method === "GET") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: sampleProjects }),
        });
      }
      // Mock POST: creating a project.
      if (url.includes("/api/v1/projects") && options?.method === "POST") {
        const newProject = JSON.parse(options.body as string);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: { ...newProject, id: 3 } }),
        });
      }
      // Mock DELETE: deleting a project.
      if (url.includes("/api/v1/projects") && options?.method === "DELETE") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Project deleted successfully" }),
        });
      }
      // Mock PUT: updating a project.
      if (url.includes("/api/v1/projects") && options?.method === "PUT") {
        const updatedProject = JSON.parse(options.body as string);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: updatedProject }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      });
    }) as jest.Mock;

    // Set a dummy auth token in localStorage.
    localStorage.setItem("authToken", "test-token");
    mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays loading state and then renders main content", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Initially, the loading message should appear.
    expect(screen.getByText(/Loading projects.../i)).toBeInTheDocument();

    // After projects load, the main content (e.g., welcome message) should appear.
    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });
  });

  test("renders ProjectTable with fetched projects", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait until at least one table cell with the exact text "Project One" is found.
    await waitFor(() => {
      const cell = screen.getByText(/^Project One$/);
      expect(cell).toBeInTheDocument();
    });

    // Additionally, confirm that each project title from our sample is rendered.
    sampleProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  test("navigates to project detail when a row is clicked", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for projects to be rendered.
    await waitFor(() => {
      expect(screen.getByText(/^Project One$/)).toBeInTheDocument();
    });

    // Identify the row that contains the exact text "Project One".
    const projectRow = screen.getByText(/^Project One$/).closest("tr");
    if (projectRow) {
      fireEvent.click(projectRow);
    }
    expect(mockedNavigate).toHaveBeenCalledWith("/projects/1");
  });

  test("opens create project form when 'Create a Project' button is clicked", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Ensure the main dashboard content is rendered.
    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });

    // Click the "Create a Project" button.
    const createButton = screen.getByRole("button", { name: /create a project/i });
    fireEvent.click(createButton);

    // Verify that the create project form is displayed.
    await waitFor(() => {
      expect(screen.getByText(/Dashboard \/ Create Project/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: /Create a New Project/i })).toBeInTheDocument();
  });
});
