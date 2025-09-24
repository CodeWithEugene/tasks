
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
  completed: boolean;
  priority: Priority;
  category: Category;
}
