// TaskEditDialog.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskEditDialog from "../TaskEditDialog";
import { Task, User } from "../../../types";

// Mockear useAuth para devolver un usuario de prueba
jest.mock("../../../context", () => ({
  useAuth: () => ({
    user: { email: "test@example.com" },
  }),
}));

// Ejemplo de tarea para pruebas
const sampleTask: Task = {
  id: 1,
  title: "Sample Task",
  description: "This is a sample task description",
  discussion: "Some initial discussion",
  createdBy: "creator@example.com",
  updatedBy: "creator@example.com",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  statusId: "status1",
  ticketId: 1,
  order: 1,
  estimatedHours: 5,
  remainingHours: 3,
  completedHours: 2,
};

// Usuarios de ejemplo para el select "Assigned To"
const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", projects: [] },
  { id: "2", name: "Bob", email: "bob@example.com", projects: [] },
];

describe("TaskEditDialog Component", () => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (taskProp: Task | null) => {
    return render(
      <TaskEditDialog
        open={true}
        task={taskProp}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
        users={users}
        disabled={false}
      />
    );
  };

  it("renders dialog with initial task values", () => {
    renderComponent(sampleTask);
    // Verifica que el campo title tenga el valor inicial
    const titleInput = screen.getByPlaceholderText(
      /task title/i
    ) as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe(sampleTask.title);

    // Verifica que el campo description tenga el valor inicial
    const descriptionInput = screen.getByPlaceholderText(
      /add a more detailed description/i
    ) as HTMLInputElement;
    expect(descriptionInput.value).toBe(sampleTask.description);

    // Verifica el campo discussion
    const discussionInput = screen.getByPlaceholderText(
      /add notes or discussion points/i
    ) as HTMLInputElement;
    expect(discussionInput.value).toBe(sampleTask.discussion);
  });

  it("calls onClose when Cancel is clicked", () => {
    renderComponent(sampleTask);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onSave with updated task data when Save is clicked", async () => {
    renderComponent(sampleTask);
    const titleInput = screen.getByPlaceholderText(
      /task title/i
    ) as HTMLInputElement;
    // Simula un cambio en el título
    fireEvent.change(titleInput, {
      target: { value: "Updated Task Title", name: "title" },
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated Task Title",
          updatedBy: "test@example.com",
        })
      );
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onDelete with task data and then onClose when Delete is clicked", async () => {
    renderComponent(sampleTask);
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(sampleTask);
    });
    expect(onClose).toHaveBeenCalled();
  });
});
