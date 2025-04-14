// ProtectedRoute.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

// Import the useAuth hook from its module.
import { useAuth } from "../hooks/useAuth";

// Mock the useAuth hook to control the authentication state for testing.
jest.mock("../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("ProtectedRoute Component", () => {
  const mockedUseAuth = useAuth as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: When the authentication hook is loading
  it("should display a loading screen if the authentication state is loading", () => {
    // Arrange: Set the loading state to true
    mockedUseAuth.mockReturnValue({
      loading: true,
      isAuthenticated: false,
      isVerified: false,
    });

    // Act: Render the component inside a MemoryRouter
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert: Verify that the "Loading..." text is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test case 2: When the user is not authenticated
  it("should redirect to /login if the user is not authenticated", () => {
    // Arrange: User is not authenticated
    mockedUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: false,
      isVerified: false,
    });

    // Act: Render the ProtectedRoute with routes for redirection testing
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          {/* The route for the login page */}
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Assert: Verify that the login page is rendered
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  // Test case 3: When the user is authenticated but not verified and verification is required
  it("should redirect to /verify-email if the user is authenticated but not verified while verification is required", () => {
    // Arrange: User is authenticated but not verified, and verification is required
    mockedUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isVerified: false,
    });

    // Act: Render the component inside a MemoryRouter with a route for verify-email redirection.
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/verify-email" element={<div>Verify Email Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute requireVerified={true}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Assert: Verify that the verify email page is rendered
    expect(screen.getByText("Verify Email Page")).toBeInTheDocument();
  });

  // Test case 4: When the user is authenticated and verified
  it("should render the protected children if the user is authenticated and verified", () => {
    // Arrange: User is authenticated and verified
    mockedUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isVerified: true,
    });

    // Act: Render the ProtectedRoute with a child element
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert: Verify that the protected content is rendered
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  // Test case 5: When the verification is not required even if the user is not verified
  it("should render the protected children if verification is not required, even if the user is not verified", () => {
    // Arrange: User is authenticated but not verified, yet verification is not required
    mockedUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isVerified: false,
    });

    // Act: Render the component while setting requireVerified to false
    render(
      <MemoryRouter>
        <ProtectedRoute requireVerified={false}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert: Verify that the protected content is rendered
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
