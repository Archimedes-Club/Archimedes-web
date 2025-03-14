import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../../components/Dashboard";
import { MemoryRouter } from "react-router-dom";

// Globally mock fetch and alert
beforeEach(() => {
  jest.spyOn(global, "fetch");
  window.alert = jest.fn();
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("Dashboard Component - Extended Tests", () => {
  test("displays a loading message and then renders fetched projects", async () => {
    const fakeProjects = {
      data: [
        {
          id: 1,
          title: "Test Project",
          description: "A test project",
          status: "Ongoing",
          category: "Web",
          team_lead: "Alice",
          team_size: 3,
        },
      ],
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Initially, a loading message should be displayed
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();

    // Wait for the project to be displayed after data is loaded
    await waitFor(() => {
      expect(screen.getByText(/^Test Project$/i)).toBeInTheDocument();
    });
  });

  test('opens the "Create a Project" form when clicking the button', async () => {
    const fakeProjects = { data: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });

    const createButton = screen.getByRole("button", { name: /create a project/i });
    fireEvent.click(createButton);

    expect(screen.getByText(/Create a New Project/i)).toBeInTheDocument();
  });

  test("submits a new project and updates the project list", async () => {
    const fakeProjects = { data: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });

    // Open the create project form
    const createButton = screen.getByRole("button", { name: /create a project/i });
    fireEvent.click(createButton);

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText(/enter project title/i), {
      target: { value: "New Project" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: "A new project description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter team size/i), {
      target: { value: "4" },
    });
    // For select elements, get them using getAllByRole
    const [statusSelect, categorySelect] = screen.getAllByRole("combobox");
    fireEvent.change(statusSelect, { target: { value: "Ongoing" } });
    fireEvent.change(categorySelect, { target: { value: "Web" } });
    fireEvent.change(screen.getByPlaceholderText(/enter team lead/i), {
      target: { value: "Bob" },
    });

    // Simulate the POST request response
    const createdProject = {
      data: {
        id: 2,
        title: "New Project",
        description: "A new project description",
        status: "Ongoing",
        category: "Web",
        team_lead: "Bob",
        team_size: 4,
      },
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createdProject,
    });

    const submitButton = screen.getByRole("button", { name: /^Create Project$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/^New Project$/i)).toBeInTheDocument();
    });
  });

  test("deletes a project and removes it from the list", async () => {
    const fakeProjects = {
      data: [
        {
          id: 1,
          title: "Delete Me",
          description: "Project to be deleted",
          status: "Ongoing",
          category: "Web",
          team_lead: "Alice",
          team_size: 3,
        },
      ],
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/^Delete Me$/i)).toBeInTheDocument();
    });

    // Simulate a successful DELETE API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Project deleted successfully" }),
    });

    // Assume the delete button is identified by data-testid="DeleteIcon"
    const deleteIcon = screen.getByTestId("DeleteIcon");
    const deleteButton = deleteIcon.closest("button");
    if (deleteButton) {
      fireEvent.click(deleteButton);
    } else {
      throw new Error("Delete button not found");
    }

    await waitFor(() => {
      expect(screen.queryByText(/^Delete Me$/i)).not.toBeInTheDocument();
    });
  });

  test("submits an edited project and updates the project list", async () => {
    // Initially return one project
    const fakeProjects = {
      data: [
        {
          id: 1,
          title: "Old Project",
          description: "Old description",
          status: "Ongoing",
          category: "Web",
          team_lead: "Alice",
          team_size: 3,
        },
      ],
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for the project to appear
    await waitFor(() => {
      expect(screen.getByText(/^Old Project$/i)).toBeInTheDocument();
    });

    // Assume the edit button is identified by data-testid="EditIcon"
    const editIcon = screen.getByTestId("EditIcon");
    const editButton = editIcon.closest("button");
    if (editButton) {
      fireEvent.click(editButton);
    } else {
      throw new Error("Edit button not found");
    }

    // The form should be pre-filled with the old project data
    expect(screen.getByDisplayValue("Old Project")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old description")).toBeInTheDocument();

    // Modify the form fields
    fireEvent.change(screen.getByPlaceholderText(/enter project title/i), {
      target: { value: "Updated Project" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: "Updated description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter team size/i), {
      target: { value: "5" },
    });
    const [statusSelect, categorySelect] = screen.getAllByRole("combobox");
    fireEvent.change(statusSelect, { target: { value: "Hiring" } });
    fireEvent.change(categorySelect, { target: { value: "Research" } });
    fireEvent.change(screen.getByPlaceholderText(/enter team lead/i), {
      target: { value: "Bob" },
    });

    // Simulate the PUT request response with updated project data
    const updatedProject = {
      data: {
        id: 1,
        title: "Updated Project",
        description: "Updated description",
        status: "Hiring",
        category: "Research",
        team_lead: "Bob",
        team_size: 5,
      },
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProject,
    });

    // Submit the updated project
    const updateButton = screen.getByRole("button", { name: /^Update Project$/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/^Updated Project$/i)).toBeInTheDocument();
    });
  });

  test("shows alert and prevents submission when required fields are empty on create", async () => {
    const fakeProjects = { data: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });

    const createButton = screen.getByRole("button", { name: /create a project/i });
    fireEvent.click(createButton);

    // Clear required fields and submit the form
    fireEvent.change(screen.getByPlaceholderText(/enter project title/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter team size/i), {
      target: { value: "0" },
    });

    const submitButton = screen.getByRole("button", { name: /^Create Project$/i });
    fireEvent.click(submitButton);

    // Verify that alert was called to indicate error
    expect(window.alert).toHaveBeenCalled();
  });

  test("cancels the create/edit form correctly", async () => {
    const fakeProjects = { data: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });

    // Open the create form
    const createButton = screen.getByRole("button", { name: /create a project/i });
    fireEvent.click(createButton);

    expect(screen.getByText(/Create a New Project/i)).toBeInTheDocument();

    // Click the Cancel button (ensure its type is button)
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Should return to the main page showing the welcome message
    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });
  });

  test("handles API error on project update", async () => {
    // Initially return one project
    const fakeProjects = {
      data: [
        {
          id: 1,
          title: "Project Error",
          description: "Description",
          status: "Ongoing",
          category: "Web",
          team_lead: "Alice",
          team_size: 3,
        },
      ],
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/^Project Error$/i)).toBeInTheDocument();
    });

    // Open the edit form
    const editIcon = screen.getByTestId("EditIcon");
    const editButton = editIcon.closest("button");
    if (editButton) {
      fireEvent.click(editButton);
    } else {
      throw new Error("Edit button not found");
    }

    // Modify the title field
    fireEvent.change(screen.getByPlaceholderText(/enter project title/i), {
      target: { value: "Updated Error" },
    });

    // Simulate a PUT request that returns an error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Update failed", errors: {} }),
    });

    const updateButton = screen.getByRole("button", { name: /^Update Project$/i });
    fireEvent.click(updateButton);

    // Verify that alert was called to indicate error
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });

  test("handles API error on project creation", async () => {
    const fakeProjects = { data: [] };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProjects,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome Prof\. Lopez/i)).toBeInTheDocument();
    });

    const createButton = screen.getByRole("button", { name: /create a project/i });
    fireEvent.click(createButton);

    // Fill in form data
    fireEvent.change(screen.getByPlaceholderText(/enter project title/i), {
      target: { value: "Error Project" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: "Error description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter team size/i), {
      target: { value: "2" },
    });
    const [statusSelect, categorySelect] = screen.getAllByRole("combobox");
    fireEvent.change(statusSelect, { target: { value: "Ongoing" } });
    fireEvent.change(categorySelect, { target: { value: "Web" } });
    fireEvent.change(screen.getByPlaceholderText(/enter team lead/i), {
      target: { value: "Charlie" },
    });

    // Simulate a POST request that returns an error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Creation failed", errors: {} }),
    });

    const submitButton = screen.getByRole("button", { name: /^Create Project$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
