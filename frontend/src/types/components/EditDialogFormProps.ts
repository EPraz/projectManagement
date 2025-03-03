import { DefaultValues, Path } from "react-hook-form";
import type * as yup from "yup";

export interface Section {
  title: string;
  fields: string[];
  expanded?: boolean;
}

export interface SelectFieldOption {
  id: string;
  name: string;
  position?: number;
}

export interface SelectField<T> {
  name: Path<T>;
  label: string;
  options: SelectFieldOption[];
}

export interface EditDialogFormProps<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  onDelete?: (data: T) => void;
  onSubmit: (data: T) => void;
  schema: yup.ObjectSchema<T>;
  defaultValues: DefaultValues<T>;
  title?: string;
  idNumber: string;
  disabled?: boolean;
  sections?: Section[];
  selectFields?: SelectField<T>[] | SelectField<Partial<T>>[];
  rightPanelFields?: Path<T>[];
  topCenterFields?: Path<T>[];
  categoryType: string;
  user?: {
    name: string;
    initials: string;
  };
}
