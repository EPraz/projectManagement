// Header.test.tsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { projectSections } from "../../projectNavigation/sections";
import { ThemeProvider } from "../../../context/themeContext";
import { AuthProvider } from "../../../context";

// Mockear useNavigate y useLocation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/projects/123/overview",
    }),
  };
});

jest.mock("../../../constants/apiConstant", () => ({
  API_URL: "http://localhost:3000",
}));

describe("Header Component", () => {
  const projectName = "Test Project";
  const projectId = "123";

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  const renderHeader = () =>
    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter>
            <Header projectName={projectName} projectId={projectId} />
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>,
    );

  it("match snapshot", async () => {
    await act(async () => {
      const { asFragment } = renderHeader();
      expect(asFragment).toMatchSnapshot();
    });
  });

  it("renders project title", async () => {
    await act(async () => {
      renderHeader();
    });
    expect(screen.getByText(projectName)).toBeInTheDocument();
  });

  it("renders tabs based on MENU_ITEMS", async () => {
    await act(async () => {
      renderHeader();
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Open project navigation" }),
    );
    projectSections.forEach((item) =>
      expect(
        screen.getByRole("button", { name: item.label }),
      ).toBeInTheDocument(),
    );
  });

  it("navigates to a new tab when a different tab is clicked", async () => {
    await act(async () => {
      renderHeader();
    });

    // currentTab se obtiene de la URL: en nuestro mock es "overview"
    // Escogemos una tab cuyo valor (path) sea diferente, por ejemplo, "dashboard"
    fireEvent.click(
      screen.getByRole("button", { name: "Open project navigation" }),
    );
    const tabToClick = screen.getByRole("button", {
      name: "Taskboard",
    });
    fireEvent.click(tabToClick);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/projects/${projectId}/board?tab=board`,
    );
  });

  it("does not navigate if the selected tab is the current tab", async () => {
    await act(async () => {
      renderHeader();
    });
    // En nuestro mock useLocation, la tab actual es "overview"
    fireEvent.click(
      screen.getByRole("button", { name: "Open project navigation" }),
    );
    const tab = screen.getByRole("button", { name: "Overview" });
    fireEvent.click(tab);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
