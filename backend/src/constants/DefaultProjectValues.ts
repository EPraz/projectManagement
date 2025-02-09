interface StatusSeed {
  name: string;
  position: number;
  color: string;
}

export const defaultEpicStatuses: StatusSeed[] = [
  { name: 'NEW', position: 0, color: '#4CAF50' }, // Verde
  { name: 'ANALYZING', position: 1, color: '#FF9800' }, // Naranja
  { name: 'PLANNING', position: 2, color: '#03A9F4' }, // Azul
  { name: 'IN_PROGRESS', position: 3, color: '#2196F3' }, // Azul oscuro
  { name: 'BLOCKED', position: 4, color: '#F44336' }, // Rojo
  { name: 'COMPLETED', position: 5, color: '#8BC34A' }, // Verde claro
  { name: 'ARCHIVED', position: 6, color: '#9E9E9E' }, // Gris
];

export const defaultFeatureStatuses: StatusSeed[] = [
  { name: 'NEW', position: 0, color: '#4CAF50' },
  { name: 'ANALYZING', position: 1, color: '#FF9800' },
  { name: 'PLANNING', position: 2, color: '#03A9F4' },
  { name: 'IN_PROGRESS', position: 3, color: '#2196F3' },
  { name: 'BLOCKED', position: 4, color: '#F44336' },
  { name: 'READY_FOR_TESTING', position: 5, color: '#FFEB3B' }, // Amarillo
  { name: 'TESTING', position: 6, color: '#FFC107' },
  { name: 'DEPLOYMENT', position: 7, color: '#3F51B5' }, // Azul oscuro
  { name: 'COMPLETED', position: 8, color: '#8BC34A' },
  { name: 'ARCHIVED', position: 9, color: '#9E9E9E' },
];

export const defaultTicketStatuses: StatusSeed[] = [
  { name: 'NEW', position: 0, color: '#4CAF50' },
  { name: 'OPEN', position: 1, color: '#2196F3' },
  { name: 'IN_PROGRESS', position: 2, color: '#03A9F4' },
  { name: 'BLOCKED', position: 3, color: '#F44336' },
  { name: 'CODE_REVIEW', position: 4, color: '#673AB7' }, // Morado
  { name: 'TESTING', position: 5, color: '#FFEB3B' },
  { name: 'DEPLOYMENT', position: 6, color: '#3F51B5' },
  { name: 'COMPLETED', position: 7, color: '#8BC34A' },
  { name: 'CLOSED', position: 8, color: '#9E9E9E' },
  { name: 'COMMITTED', position: 9, color: '#009688' }, // Verde agua
  { name: 'ANALYZING', position: 10, color: '#FF9800' },
];

export const defaultTaskStatuses: StatusSeed[] = [
  { name: 'TODO', position: 0, color: '#9E9E9E' },
  { name: 'IN_PROGRESS', position: 1, color: '#2196F3' },
  { name: 'BLOCKED', position: 2, color: '#F44336' },
  { name: 'CODE_REVIEW', position: 3, color: '#673AB7' },
  { name: 'TESTING', position: 4, color: '#FFEB3B' },
  { name: 'DONE', position: 5, color: '#4CAF50' },
];
