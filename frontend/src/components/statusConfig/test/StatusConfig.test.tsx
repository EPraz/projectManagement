import { render, screen, fireEvent } from "@testing-library/react";
import StatusConfig from "../StatusConfig";
import { MemoryRouter } from "react-router-dom";

// Mock de useSnackbar para controlar el mensaje
const mockShowSnackbarMessage = jest.fn();
jest.mock("../../../context", () => ({
  useSnackbar: () => ({
    showSnackbarMessage: mockShowSnackbarMessage,
  }),
}));

// Mock de formatStatusName para simplificar (capitaliza la primera letra)
jest.mock("../../../helpers", () => ({
  formatStatusName: (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1),
}));

// Datos de prueba para los status (TaskStatus)
const items = [
  { id: "1", name: "todo", position: 2, color: "#ff0000" },
  { id: "2", name: "in-progress", position: 1, color: "#00ff00" },
  { id: "3", name: "done", position: 3, color: "#0000ff" },
];

// Función auxiliar para renderizar el componente con contexto de react-router
const renderStatusConfig = (selectedStatuses = [items[1]]) => {
  const setSelectedStatuses = jest.fn();
  return {
    setSelectedStatuses,
    ...render(
      <MemoryRouter>
        <StatusConfig
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          items={items}
        />
      </MemoryRouter>
    ),
  };
};

describe("StatusConfig Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", () => {
    const { asFragment } = renderStatusConfig();
    expect(asFragment()).toMatchSnapshot();
  });

  it("opens the menu when settings icon is clicked", () => {
    renderStatusConfig();
    const settingsButton = screen.getByRole("button");
    fireEvent.click(settingsButton);
    // Verificamos que se muestre el encabezado del menú
    expect(screen.getByText(/column visibility/i)).toBeInTheDocument();
  });

  it("renders menu items in sorted order", () => {
    renderStatusConfig();
    fireEvent.click(screen.getByRole("button"));
    // Esperamos que los items se ordenen por posición: primero "in-progress" (position 1), luego "todo" (position 2), luego "done" (position 3)
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems[0]).toHaveTextContent("In-progress");
    expect(menuItems[1]).toHaveTextContent("Todo");
    expect(menuItems[2]).toHaveTextContent("Done");
  });

  it("toggles a status when a menu item is clicked", () => {
    // Inicialmente, seleccionamos el status "in-progress" (id "2")
    const { setSelectedStatuses } = renderStatusConfig([items[1]]);
    fireEvent.click(screen.getByRole("button"));
    // Al hacer clic en "Todo" (id "1"), que no estaba seleccionado, se debe agregar.
    const todoMenuItem = screen.getByText("Todo").closest("li");
    fireEvent.click(todoMenuItem!);
    expect(setSelectedStatuses).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "2" }),
        expect.objectContaining({ id: "1" }),
      ])
    );
  });

  it("shows snackbar message if removing the last selected status", () => {
    // Inicialmente, seleccionamos solo "in-progress"
    renderStatusConfig([items[1]]);
    fireEvent.click(screen.getByRole("button"));
    // Al hacer clic en "In-progress" para removerlo, se debe evitar que la lista quede vacía.
    const inProgressMenuItem = screen.getByText("In-progress").closest("li");
    fireEvent.click(inProgressMenuItem!);
    // Se espera que se muestre el mensaje de snackbar
    expect(mockShowSnackbarMessage).toHaveBeenCalledWith(
      "You cannot disable all statuses at once",
      "info"
    );
  });

  it("toggles status when switch is toggled", () => {
    // Inicialmente, seleccionamos solo "in-progress"
    const { setSelectedStatuses } = renderStatusConfig([items[1]]);
    fireEvent.click(screen.getByRole("button"));
    // Obtenemos todos los switch (checkbox) y seleccionamos el de "Todo"
    const switches = screen.getAllByRole("checkbox");
    // Suponemos que el primer switch corresponde a "In-progress" y el segundo a "Todo"
    const todoSwitch = switches[1];
    fireEvent.click(todoSwitch);
    expect(setSelectedStatuses).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "2" }),
        expect.objectContaining({ id: "1" }),
      ])
    );
  });
});
