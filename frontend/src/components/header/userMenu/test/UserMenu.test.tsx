// UserMenu.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import UserMenu from "../UserMenu";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../../../context";
import { User } from "../../../../types";

// Mockea useNavigate de react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
      <AuthContext.Provider
        value={{
          user,
          logout: mockLogout,
          login: jest.fn(),
          register: jest.fn(),
          instantLogin: jest.fn(),
          loading: false,
          accessToken: "fake-token",
        }}
      >
        <MemoryRouter>
          <UserMenu />
        </MemoryRouter>
      </AuthContext.Provider>
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

  it("calls logout and navigates on clicking Logout", () => {
    renderWithAuth();
    // Abrir el menú
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);
    // Buscar el menú y luego la opción de Logout (buscamos por el texto "Logout")
    const logoutMenuItem = screen.getByText("Logout");
    fireEvent.click(logoutMenuItem);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
  });

  it("renders disabled Profile and Settings menu items", () => {
    renderWithAuth();
    fireEvent.click(screen.getByRole("button"));
    // Los MenuItem con texto "Profile" y "Settings" están deshabilitados.
    const profileMenuItem = screen.getByText("Profile").closest("li");
    const settingsMenuItem = screen.getByText("Settings").closest("li");
    // Material UI agrega la propiedad disabled como un atributo en el DOM (a veces 'aria-disabled')
    expect(profileMenuItem).toHaveAttribute("aria-disabled", "true");
    expect(settingsMenuItem).toHaveAttribute("aria-disabled", "true");
  });
});
