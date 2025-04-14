// src/__tests__/components/ProjectDetail.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProjectDetail from "../../components/ProjectDetail";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useParams and useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ projectId: "1" }),
  useNavigate: () => mockedNavigate,
}));

describe("ProjectDetail Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("displays loading state and then renders project details", async () => {
    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    // Initially, the loading message should appear.
    expect(screen.getByText(/Loading project details/i)).toBeInTheDocument();

    // Wait until the project title appears. Use a flexible matcher in case the text is split.
    const projectTitle = await screen.findByText((content) =>
      content.includes("Website Redesign") && content.includes("Aiko & Associates")
    );
    expect(projectTitle).toBeInTheDocument();

    expect(screen.getByText("BLUEGROUSE FINANCE PTY LTD")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(
      screen.getByText(/The project involves a complete redesign/i)
    ).toBeInTheDocument();
  });

  test("navigates back to projects when back button is clicked", async () => {
    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    // Wait until the back button (with text 'BACK TO PROJECTS') is rendered.
    const backButton = await screen.findByText(/BACK TO PROJECTS/i);
    fireEvent.click(backButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/ongoingprojects");
  });

  test("opens and handles remove member dialog", async () => {
    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    // Wait until the member's name appears.
    await waitFor(() => {
      expect(screen.getByText(/Aiden Smith/i)).toBeInTheDocument();
    });

    // Click the "Remove Member" button.
    const removeButton = screen.getByRole("button", { name: /Remove Member/i });
    fireEvent.click(removeButton);

    // Verify the confirmation dialog appears.
    expect(
      screen.getByText(/Are you sure you want to remove this member/i)
    ).toBeInTheDocument();

    // Click "Okay" to confirm removal.
    const okayButton = screen.getByRole("button", { name: /Okay/i });
    fireEvent.click(okayButton);

    // Wait for the member to be removed.
    await waitFor(() => {
      expect(screen.queryByText(/Aiden Smith/i)).not.toBeInTheDocument();
    });
  });

  test("displays the Project Members tab by default", async () => {
    render(
      <BrowserRouter>
        <ProjectDetail />
      </BrowserRouter>
    );

    // Wait until project details load.
    await waitFor(() => {
      expect(screen.getByText(/Project details/i)).toBeInTheDocument();
    });

    // Wait until the member's name appears in the tab content.
    const memberName = await screen.findByText(/Aiden Smith/i);
    expect(memberName).toBeInTheDocument();
  });
});
