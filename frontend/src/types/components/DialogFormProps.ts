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
}
