// DialogForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as yup from "yup";
import DialogForm from "../DialogForm";

interface FormData {
  name: string;
  email: string;
}

// Esquema simple con Yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

// Valores por defecto para el formulario
const defaultValues: FormData = {
  name: "",
  email: "",
};

// Field config con placeholders para facilitar la búsqueda
const fieldConfig = {
  name: { label: "Name", type: "text" as const, placeholder: "Enter name" },
  email: { label: "Email", type: "text" as const, placeholder: "Enter email" },
};

describe("DialogForm Component", () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", () => {
    const { asFragment } = render(
      <DialogForm<FormData>
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        schema={schema}
        defaultValues={defaultValues}
        title="Test Dialog"
        fieldConfig={fieldConfig}
        disabled={false}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders dialog with title and fields", () => {
    render(
      <DialogForm<FormData>
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        schema={schema}
        defaultValues={defaultValues}
        title="Test Dialog"
        fieldConfig={fieldConfig}
        disabled={false}
      />
    );

    expect(screen.getByText(/test dialog/i)).toBeInTheDocument();
    // Verificamos que se muestren los placeholders
    expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  });

  it("calls onSubmit with form data on Save", async () => {
    render(
      <DialogForm<FormData>
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        schema={schema}
        defaultValues={defaultValues}
        title="Test Dialog"
        fieldConfig={fieldConfig}
        disabled={false}
      />
    );

    const nameInput = screen.getByPlaceholderText(/enter name/i);
    const emailInput = screen.getByPlaceholderText(/enter email/i);

    // Simula cambios en los inputs
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    // Clic en el botón Save (submit)
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <DialogForm<FormData>
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        schema={schema}
        defaultValues={defaultValues}
        title="Test Dialog"
        fieldConfig={fieldConfig}
        disabled={false}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(
      <DialogForm<FormData>
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        onDelete={onDelete}
        schema={schema}
        defaultValues={defaultValues}
        title="Test Dialog"
        fieldConfig={fieldConfig}
        disabled={false}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });
});
