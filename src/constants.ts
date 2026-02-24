import type { Column, User } from './types'; // <-- Added 'type' keyword

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'col-1', title: 'To Do', order: 0 },
  { id: 'col-2', title: 'In Progress', order: 1 },
  { id: 'col-3', title: 'In Review', order: 2 },
  { id: 'col-4', title: 'Done', order: 3 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Siddahnt', avatar: 'bg-rose-500', initials: 'AS' },
  { id: 'u2', name: 'Satyam', avatar: 'bg-blue-500', initials: 'BJ' },
  { id: 'u3', name: 'Uday', avatar: 'bg-emerald-500', initials: 'CD' },
  { id: 'u4', name: 'Bablu', avatar: 'bg-purple-500', initials: 'DP' },
];