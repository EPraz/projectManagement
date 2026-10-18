// UserMenu.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../../context/themeContext";
import UserMenu from "../UserMenu";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../../../context";
import { User } from "../../../../types";

// Mockea getInitials para simplificar la prueba
jest.mock("../../../../helpers", () => ({
  getInitials: (name: string | undefined) => (name ? name[0] : "U"),
}));

describe("UserMenu Component", () => {
  const mockLogout = jest.fn();

  // Define un usuario de prueba
  const user: User = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    projects: [],
  };

  // Crea una función para renderizar el componente envuelto en el AuthContext y MemoryRouter
  const renderWithAuth = () =>
    render(
      <ThemeProvider>
        <AuthContext.Provider
          value={{
            user,
            logout: mockLogout,
            instantLogin: jest.fn(),
            loading: false,
            accessToken: "fake-token",
            restoring: false,
            closing: false,
            sessionError: null,
            sessionNotice: "",
            retrySession: jest.fn(),
            request: jest.fn(),
          }}
        >
          <MemoryRouter>
            <UserMenu />
          </MemoryRouter>
        </AuthContext.Provider>
      </ThemeProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", async () => {
    const { asFragment } = renderWithAuth();
    expect(asFragment).toMatchSnapshot();
  });

  it("renders the user avatar with initials", () => {
    renderWithAuth();
    // El avatar debería mostrar la inicial "J" (de John)
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("opens menu when avatar is clicked", () => {
    renderWithAuth();
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);
    // Se espera que aparezca el menú, que tiene role "menu"
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("calls the session logout action and closes the menu", async () => {
    renderWithAuth();
    // Abrir el menú
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);
    // Buscar el menú y luego la opción de Logout (buscamos por el texto "Logout")
    const logoutMenuItem = screen.getByText("Logout");
    fireEvent.click(logoutMenuItem);
    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("explains the shared demo and offers appearance preferences without account placeholders", () => {
    renderWithAuth();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Shared demo workspace")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemcheckbox", {
        name: /Follow system appearance/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });
});
