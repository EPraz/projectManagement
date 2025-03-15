import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TicketEditDialog from "../TicketEditDialog";
import { MemoryRouter } from "react-router-dom";
import { Sprint, Ticket, User } from "../../../types";
import { TicketPriority, TicketType } from "../../../constants";

// Mocks de contexto
const mockAuth = {
  user: { email: "testuser@example.com" },
};
jest.mock("../../../context", () => ({
  useAuth: () => mockAuth,
  useSprint: () => ({
    sprint: { id: "sprint1" },
  }),
}));

// Datos de ejemplo
const sampleTicket: Ticket = {
  id: 1,
  title: "Initial Ticket Title",
  description: "Initial description",
  discussion: "Initial discussion",
  createdBy: "creator@example.com",
  updatedBy: "creator@example.com",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  statusId: "status1",
  status: {
    id: "status1",
    name: "status1",
    position: 1,
  },
  order: 1,
  estimatedHours: 5,
  remainingHours: 3,
  completedHours: 2,
  priority: TicketPriority.HIGH,
  type: TicketType.BUG,
  tasks: [],
  assignedTo: "1",
  _count: null,
  pairProgrammingUsers: [],
};

const sampleStatuses = [
  { id: "status1", name: "OPEN", color: "#00ff00", position: 1 },
  { id: "status2", name: "BLOCKED", color: "#ff0000", position: 2 },
  { id: "status3", name: "CLOSED", color: "#0000ff", position: 3 },
];

const sampleUsers: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", projects: [] },
  { id: "2", name: "Bob", email: "bob@example.com", projects: [] },
];

const sampleSprints: Sprint[] = [
  {
    id: "sprint1",
    name: "Sprint 1",
    projectId: "123",
    createdAt: "asdf",
    updatedAt: "",
    sprintGoal: [],
    tickets: [],
    project: {
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
    },
  },
];

const sampleTickets = [sampleTicket];

describe("TicketEditDialog Component", () => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const onDelete = jest.fn();

  const renderComponent = (ticketProp = sampleTicket) =>
    render(
      <MemoryRouter>
        <TicketEditDialog
          open={true}
          ticket={ticketProp}
          onClose={onClose}
          onSave={onSave}
          onDelete={onDelete}
          statuses={sampleStatuses}
          users={sampleUsers}
          sprints={sampleSprints}
          features={[]}
          tickets={sampleTickets}
          disabled={false}
          projects={[]}
        />
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders dialog with initial ticket values", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText(
      /ticket title/i
    ) as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe(sampleTicket.title);

    const descriptionInput = screen.getByPlaceholderText(
      /add a more detailed description/i
    );
    expect(descriptionInput).toHaveValue(sampleTicket.description);
  });

  it("updates title and calls onSave with updated data", async () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText(
      /ticket title/i
    ) as HTMLInputElement;
    fireEvent.change(titleInput, {
      target: { value: "Updated Ticket Title", name: "title" },
    });

    // Clic en Save
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated Ticket Title",
          updatedBy: "testuser@example.com",
          sprintId: "sprint1",
        })
      );
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onDelete and then onClose when Delete is clicked", async () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(sampleTicket);
    });
    expect(onClose).toHaveBeenCalled();
  });

  //   it("updates assignedTo when selecting a user from dropdown", async () => {
  //     renderComponent();
  //     // Buscar el select "Assigned To" por su label
  //     const assignedSelect = screen.getByLabelText(/assigned to/i);
  //     fireEvent.mouseDown(assignedSelect);
  //     // Seleccionamos la opción "Bob"
  //     const bobOption = await screen.findByText("Bob");
  //     fireEvent.click(bobOption);
  //     // Ahora, para verificar, se espera que el select muestre "Bob"
  //     expect(assignedSelect).toHaveTextContent("Bob");
  //   });

  //   it("updates status when selecting a new status (if not blocked)", async () => {
  //     renderComponent();
  //     // Buscar el select "Status" por su label
  //     const statusSelect = screen.getByTestId("status-select");

  //     // const statusSelect = screen.getByLabelText(/status/i);
  //     fireEvent.mouseDown(statusSelect);
  //     // Seleccionamos la opción "CLOSED"
  //     const closedOption = await screen.findByText(/closed/i);
  //     fireEvent.click(closedOption);
  //     expect(statusSelect).toHaveTextContent(/closed/i);
  //   });

  it("toggles blocking status when Chip is clicked", async () => {
    renderComponent();

    const blockedChip = screen.getByText(/blocked/i);

    fireEvent.click(blockedChip);

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      // Como ejemplo: si se activa el bloqueo, se actualiza statusId con el id del status "BLOCKED" de sampleStatuses
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          isBlocked: true,
          statusId:
            sampleStatuses.find((s) => s.name === "BLOCKED")?.id ||
            expect.any(String),
        })
      );
    });
  });

  it("updates number fields when changed", () => {
    renderComponent();
    const estimatedInput = screen.getByLabelText(
      /estimated hours/i
    ) as HTMLInputElement;
    fireEvent.change(estimatedInput, {
      target: { value: "8", name: "estimatedHours" },
    });
    expect(estimatedInput.value).toBe("8");
  });

  //   it("renders additional tabs and changes content based on activeTab", () => {
  //     renderComponent();
  //     // Verifica que se renderice la pestaña "Details" inicialmente
  //     expect(screen.getByText(/ticket information/i)).toBeInTheDocument();
  //     // Simula cambiar a la pestaña "Planning"
  //     const planningTab = screen.getByRole("tab", { name: /planning/i });
  //     fireEvent.click(planningTab);
  //     expect(screen.getByText(/sprint/i)).toBeInTheDocument();
  //     // Cambia a "Additional Info"
  //     const additionalTab = screen.getByRole("tab", { name: /additional info/i });
  //     fireEvent.click(additionalTab);
  //     expect(screen.getByText(/acceptance criteria/i)).toBeInTheDocument();
  //   });
});
