// Header.test.tsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { MENU_ITEMS } from "../../../constants";
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
      <AuthProvider>
        <MemoryRouter>
          <Header projectName={projectName} projectId={projectId} />
        </MemoryRouter>
      </AuthProvider>
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
    MENU_ITEMS.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });
  });

  it("navigates to a new tab when a different tab is clicked", async () => {
    await act(async () => {
      renderHeader();
    });

    // currentTab se obtiene de la URL: en nuestro mock es "overview"
    // Escogemos una tab cuyo valor (path) sea diferente, por ejemplo, "dashboard"
    const tabToClick = screen.getByText(/board/i);
    fireEvent.click(tabToClick);

    expect(mockNavigate).toHaveBeenCalledWith(`/projects/${projectId}/board`, {
      replace: true,
    });
  });

  it("does not navigate if the selected tab is the current tab", async () => {
    await act(async () => {
      renderHeader();
    });
    // En nuestro mock useLocation, la tab actual es "overview"
    const tab = screen.getByText(/overview/i);
    fireEvent.click(tab);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
