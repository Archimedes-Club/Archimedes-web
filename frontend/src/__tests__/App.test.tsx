// App.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App"; // Adjust the path to your App component

// Mock the useAuth hook to control authentication state in tests.
jest.mock("../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from "../hooks/useAuth";
const mockedUseAuth = useAuth as jest.Mock;

// Mock all the page components to return a simple div with unique text.
jest.mock("../components/Home", () => () => <div>Home Page</div>);
jest.mock("../components/Registration", () => () => <div>Registration Page</div>);
jest.mock("../components/Login", () => () => <div>Login Page</div>);
jest.mock("../components/Dashboard", () => () => <div>Dashboard Page</div>);
jest.mock("../components/AllProjects", () => () => <div>All Projects</div>);
jest.mock("../components/OngoingProjects", () => () => <div>Ongoing Projects</div>);
jest.mock("../components/ProjectDetail", () => () => <div>Project Detail</div>);
// Adjust the VerifyEmail mock to export a named export.
jest.mock("../components/VerifyEmail", () => ({
  VerifyEmail: () => <div>Verify Email</div>,
}));

describe("App Routing", () => {
  // Helper function to render App after setting the window location.
  const renderWithPath = (path: string) => {
    window.history.pushState({}, '', path);
    render(<App />);
  };

  // Test the root path "/" which should render the Home component.
  it("renders the Home component at the root path", () => {
    // In a public route, assume unauthenticated state.
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderWithPath("/");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  // Test the "/register" route renders the Registration component.
  it("renders the Registration component at /register", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderWithPath("/register");
    expect(screen.getByText("Registration Page")).toBeInTheDocument();
  });

  // Test the "/login" route when not authenticated.
  it("renders the Login component at /login when not authenticated", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderWithPath("/login");
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  // Test the "/login" route when authenticated should redirect to /dashboard.
  it("redirects from /login to /dashboard when authenticated", async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, isVerified: true });
    renderWithPath("/login");
    await waitFor(() => {
      expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });
  });

  // Test the "/dashboard" route when not authenticated should redirect to /login.
  it("redirects from /dashboard to /login when not authenticated", async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderWithPath("/dashboard");
    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  // Test the "/dashboard" route when authenticated.
  it("renders the Dashboard component at /dashboard when authenticated", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, isVerified: true });
    renderWithPath("/dashboard");
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });

  // Test unknown routes should redirect to "/" (Home component).
  it("redirects unknown routes to the Home component", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderWithPath("/non-existent");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  // Test the "/verify-email" route when authenticated but not verified.
  it("renders the VerifyEmail component at /verify-email when authenticated but not verified", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, isVerified: false });
    renderWithPath("/verify-email");
    expect(screen.getByText("Verify Email")).toBeInTheDocument();
  });

  // Test the "/all-projects" protected route.
  it("renders the AllProjects component at /all-projects when authenticated", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, isVerified: true });
    renderWithPath("/all-projects");
    expect(screen.getByText("All Projects")).toBeInTheDocument();
  });

  // Test the "/ongoingprojects" protected route.
  it("renders the OngoingProjects component at /ongoingprojects when authenticated", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, isVerified: true });
    renderWithPath("/ongoingprojects");
    expect(screen.getByText("Ongoing Projects")).toBeInTheDocument();
  });

  // Test the "/projects/:projectId" protected route.
  it("renders the ProjectDetail component at /projects/:projectId when authenticated", () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, isVerified: true });
    renderWithPath("/projects/123");
    expect(screen.getByText("Project Detail")).toBeInTheDocument();
  });
});
