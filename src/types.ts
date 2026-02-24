export enum Priority { High = 'High', Medium = 'Medium', Low = 'Low' }

export interface User { id: string; name: string; avatar: string; initials: string; }

export interface Task {
  id: string; title: string; description: string; priority: Priority;
  assigneeId: string; columnId: string; order: number; createdAt: number;
}

export interface Column { id: string; title: string; order: number; }