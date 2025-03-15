// DeleteConfirmationModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import "@testing-library/jest-dom";

describe("DeleteConfirmationModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const itemName = "Test Item";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", () => {
    const { asFragment } = render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        itemName={itemName}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the dialog with correct content", () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        itemName={itemName}
      />
    );

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(itemName, "i"))).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/i)
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        itemName={itemName}
      />
    );
    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onConfirm and then onClose when Proceed is clicked", () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        itemName={itemName}
      />
    );
    fireEvent.click(screen.getByText(/proceed/i));
    expect(mockOnConfirm).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
