export interface Todo {
  id: string;
  title: string;
  description: string;
  category: Category;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export type Category = 'ML' | 'GATE' | 'Projects' | 'Personal' | 'Work';

export interface FilterState {
  category: Category | 'all';
  status: 'all' | 'pending' | 'completed';
  dueDateFilter: 'all' | 'today' | 'week' | 'overdue';
}

export type SortOption = 'dueDate' | 'category' | 'created' | 'alphabetical' | 'manual';

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byCategory: Record<Category, number>;
}