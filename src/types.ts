export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Category {
  LEARNING = 'Learning',
  WORK = 'Work',
  PERSONAL = 'Personal',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD format
  // Optional task deadline in local-date and time string, e.g., "2025-09-24 14:30"
  deadline?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
}