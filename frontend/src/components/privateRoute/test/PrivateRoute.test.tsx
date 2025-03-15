import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";

// Mockear useAuth del contexto
jest.mock("../../../context", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require("../../../context");

describe("PrivateRoute Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", async () => {
    useAuth.mockReturnValue({
      user: { id: "1", name: "Test User", email: "test@example.com" },
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      instantLogin: jest.fn(),
      accessToken: "fake-token",
    });

    // Renderizamos un dummy Protected Component a través de Outlet
    const { asFragment } = render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/private" element={<PrivateRoute />}>
            <Route path="" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(asFragment).toMatchSnapshot();
  });

  it("renders Loading when loading is true", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      instantLogin: jest.fn(),
      accessToken: null,
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/private" element={<PrivateRoute />} />
        </Routes>
      </MemoryRouter>
    );

    // Suponiendo que el componente Loading muestra "Cargando" (o un mensaje similar)
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("renders Outlet when user exists", () => {
    useAuth.mockReturnValue({
      user: { id: "1", name: "Test User", email: "test@example.com" },
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      instantLogin: jest.fn(),
      accessToken: "fake-token",
    });

    // Renderizamos un dummy Protected Component a través de Outlet
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/private" element={<PrivateRoute />}>
            <Route path="" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /auth/login when no user and not loading", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      instantLogin: jest.fn(),
      accessToken: null,
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/private" element={<PrivateRoute />} />
          <Route path="/auth/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
