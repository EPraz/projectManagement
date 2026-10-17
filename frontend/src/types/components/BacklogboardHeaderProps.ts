import { FilterProps } from "../FilterProps";
import { Project } from "../models";

export interface BoardHeaderProps {
  columns: { key: string; label: string }[];
  visibleColumns: string[];
  setVisibleColumns: (cols: string[]) => void;
  onApplyFilter: (filters: FilterProps) => void;
  filters: FilterProps;
  setFilters: React.Dispatch<React.SetStateAction<FilterProps>>;
  project: Project | null;
}
