import { render, screen, fireEvent } from "@testing-library/react";
import SprintSelector from "../SprintSelector";
import { MemoryRouter } from "react-router-dom";

// Declaramos mocks para las funciones del contexto que se usan en SprintSelector
const handleChangeSprintMock = jest.fn();
const setSelectedSprintMock = jest.fn();
const setOpenCreateSprintDialogMock = jest.fn();
const setOpenDeleteSprintDialogMock = jest.fn();

// Creamos un mock para el contexto que se espera recibir de useOutletContext
const listOfSprintsMock = [
  { id: "1", name: "Sprint 1", projectId: "123" },
  { id: "2", name: "Sprint 2", projectId: "123" },
];
const sprintMock = { id: "1", name: "Sprint 1", projectId: "123" };

// Mocker useOutletContext para devolver el contexto simulado
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: () => ({
      loadingDeleteSprint: false,
      handleChangeSprint: handleChangeSprintMock,
      listOfSprints: listOfSprintsMock,
      setSelectedSprint: setSelectedSprintMock,
      setOpenCreateSprintDialog: setOpenCreateSprintDialogMock,
      setOpenDeleteSprintDialog: setOpenDeleteSprintDialogMock,
      sprint: sprintMock,
    }),
  };
});

describe("SprintSelector Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SprintSelector />
      </MemoryRouter>
    );

  it("match snapshot", () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders Autocomplete input with correct placeholder", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Select Sprint")).toBeInTheDocument();
  });

  it("renders 'New Sprint' option", async () => {
    renderComponent();
    // Simula clic en el input del Autocomplete para abrir la lista de opciones
    const input = screen.getByPlaceholderText("Select Sprint");
    fireEvent.mouseDown(input);
    // Espera a que se renderice la opción "New Sprint"
    const newSprintOption = await screen.findByText("New Sprint");
    expect(newSprintOption).toBeInTheDocument();
  });

  it("calls setOpenCreateSprintDialog when 'New Sprint' option is clicked", async () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Select Sprint");
    fireEvent.mouseDown(input);
    // Encuentra la opción "New Sprint"
    const newSprintOption = await screen.findByText("New Sprint");
    // Simula clic en la opción "New Sprint"
    fireEvent.click(newSprintOption);
    expect(setOpenCreateSprintDialogMock).toHaveBeenCalledWith(true);
    // No se debe llamar handleChangeSprint
    expect(handleChangeSprintMock).not.toHaveBeenCalled();
  });

  it("calls handleChangeSprint when selecting an existing sprint", async () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Select Sprint");
    fireEvent.mouseDown(input);
    // Supongamos que buscamos "Sprint 2"
    const sprintOption = await screen.findByText("Sprint 2");
    fireEvent.click(sprintOption);
    // Se espera que se llame handleChangeSprint con el id "2"
    expect(handleChangeSprintMock).toHaveBeenCalledWith("2");
  });

  it("calls setSelectedSprint and setOpenDeleteSprintDialog when delete button for Sprint 1 is clicked", async () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Select Sprint");
    fireEvent.mouseDown(input);
    // Espera a que se muestren las opciones del Autocomplete
    const sprint1Option = await screen.findByText("Sprint 1");
    expect(sprint1Option).toBeInTheDocument();

    // Obtener todos los botones de eliminación
    const deleteButtons = screen.getAllByTestId("delete-button");
    // Filtrar el botón correspondiente a "Sprint 1"
    const sprint1DeleteButton = deleteButtons.find((button) =>
      button.closest("li")?.textContent?.includes("Sprint 1")
    );
    expect(sprint1DeleteButton).toBeDefined();
    // Simular clic en el botón de eliminación
    fireEvent.click(sprint1DeleteButton!);

    expect(setSelectedSprintMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1" })
    );
    expect(setOpenDeleteSprintDialogMock).toHaveBeenCalledWith(true);
  });
});
