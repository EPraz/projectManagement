// Actualiza tu interfaz para incluir una propiedad de orden
export interface BacklogColumnsProps {
  key: string;
  label: string;
  order: number; // Añadimos una propiedad de orden explícita
  width?: string; // Opcional: ancho personalizado
}

// Actualiza tus columnas con la propiedad de orden
export const backlogColumns: BacklogColumnsProps[] = [
  { key: "order", label: "Order", order: 1, width: "10%" },
  { key: "id", label: "ID", order: 2, width: "10%" },
  { key: "state", label: "State", order: 3, width: "15%" },
  { key: "title", label: "Title", order: 4 },
  { key: "type", label: "Type", order: 5 },
  { key: "priority", label: "Priority", order: 6, width: "10%" },
  { key: "assignedTo", label: "Assigned To", order: 7 },
  { key: "sprint", label: "Sprint", order: 8 },
  { key: "dueDate", label: "Due Date", order: 9 },
  { key: "estimatedHours", label: "Est. Hours", order: 10, width: "8%" },
  { key: "remainingHours", label: "Rem. Hours", order: 11, width: "8%" },
  { key: "isBlocked", label: "Blocking", order: 12 },
  { key: "tags", label: "Tags", order: 13 },
  { key: "actions", label: "Actions", order: 14, width: "5%" },
];

// Columnas inicialmente visibles
export const initialBacklogColumns: string[] = [
  "order",
  "id",
  "state",
  "title",
  "priority",
  "tags",
  "actions",
];
