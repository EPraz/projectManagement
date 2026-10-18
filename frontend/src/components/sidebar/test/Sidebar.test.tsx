// Sidebar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { MemoryRouter } from "react-router-dom";
import { Project } from "../../../types";
import { projectSections } from "../../projectNavigation/sections";
import { createAppTheme } from "../../../utils";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as CustomThemeProvider } from "../../../context"; // Asegúrate de usar el provider que creaste en tu contexto
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";

// Para poder testear la navegación, mockeamos useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Sidebar Component", () => {
  const project: Project = {
    id: "123",
    title: "Test Project",
    createdBy: "example",
    createdAt: "zxcv",
    updatedAt: "asdf",
    epics: [],
    tickets: [],
    users: [],
    sprints: [],
    ticketStatuses: [],
    taskStatuses: [],
    epicStatuses: [],
    featureStatuses: [],
    type: "hello",
    productManagers: [],
  };
  const setSidebarOpenMock = jest.fn();

  // Para los tests, usamos el modo "light" (o el que necesites)
  const mode = "light";
  const theme = createAppTheme(mode);

  const renderSidebar = (sidebarOpen: boolean) =>
    render(
      <CustomThemeProvider>
        <MuiThemeProvider theme={theme}>
          <StyledComponentsThemeProvider theme={theme}>
            <MemoryRouter>
              <Sidebar
                project={
                  { id: "123", title: "Test Project" } as React.ComponentProps<
                    typeof Sidebar
                  >["project"]
                }
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpenMock}
              />
            </MemoryRouter>
          </StyledComponentsThemeProvider>
        </MuiThemeProvider>
      </CustomThemeProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", () => {
    const { asFragment } = renderSidebar(true);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders logo with project title when sidebar is open", () => {
    renderSidebar(true);
    expect(
      screen.getByLabelText("Test Project navigation"),
    ).toBeInTheDocument();
  });

  it("renders menu items based on MENU_ITEMS and navigates on click", () => {
    renderSidebar(true);
    projectSections.forEach((item) =>
      expect(
        screen.getByRole("button", { name: item.label }),
      ).toBeInTheDocument(),
    );
    const firstItem = screen.getByRole("button", {
      name: "Overview",
    });
    fireEvent.click(firstItem);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/projects/${project.id}/${projectSections[0].path}`,
    );
  });

  it("marks the current destination and removes unavailable settings", () => {
    renderSidebar(true);
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.queryByRole("button", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });
});
