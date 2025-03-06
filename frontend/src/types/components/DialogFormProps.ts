import { DefaultValues } from "react-hook-form";
import type * as yup from "yup";

export interface DialogFormProps<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onSubmit: (data: T) => void;
  schema: yup.ObjectSchema<T>;
  defaultValues: DefaultValues<T>;
  title: string;
  disabled: boolean;
  fieldConfig?: Record<string, FieldConfig>;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FieldConfig {
  label?: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password" | "select" | "textarea";
  options?: SelectOption[];
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}
