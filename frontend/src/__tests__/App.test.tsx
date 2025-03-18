import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { useAuth } from "../hooks/useAuth";

// Mock the components to render simple identifiable texts
jest.mock("../components/Home", () => () => <div>Home</div>);
jest.mock("../components/Login", () => () => <div>Login</div>);
jest.mock("../components/Dashboard", () => () => <div>Dashboard</div>);

// Mock useAuth hook
jest.mock("../hooks/useAuth");
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    // Replace BrowserRouter with a wrapper that just renders its children.
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("App Routing", () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  describe("when not authenticated", () => {
    beforeEach(() => {
      // Simulate non-authenticated state
      mockedUseAuth.mockReturnValue({ isAuthenticated: false });
    });

    it("renders Home at path '/'", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("renders Login at path '/login'", () => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("redirects /dashboard to /login when not authenticated", async () => {
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByText("Login")).toBeInTheDocument();
      });
    });

    it("redirects unknown path to Home", async () => {
      render(
        <MemoryRouter initialEntries={["/unknown"]}>
          <App />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByText("Home")).toBeInTheDocument();
      });
    });
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      // Simulate authenticated state
      mockedUseAuth.mockReturnValue({ isAuthenticated: true });
    });

    it("renders Dashboard at path '/dashboard'", async () => {
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });
  });
});
