export interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | boolean | Promise<void | boolean>;
  itemName: string;
  itemKey?: string;
  disabled?: boolean;
}
