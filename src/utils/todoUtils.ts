import { Todo, Category, SortOption } from '@/types/todo';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isOverdue = (dueDate: Date): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return due < today;
};

export const getDaysUntilDue = (dueDate: Date): number => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDueDate = (dueDate: Date): string => {
  const days = getDaysUntilDue(dueDate);
  
  if (days < 0) {
    return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else if (days <= 7) {
    return `Due in ${days} days`;
  } else {
    return dueDate.toLocaleDateString();
  }
};

export const getCategoryColor = (category: Category): string => {
  const colors = {
    ML: 'category-ml',
    GATE: 'category-gate',
    Projects: 'category-projects',
    Personal: 'category-personal',
    Work: 'category-work'
  };
  return colors[category];
};

export const sortTodos = (a: Todo, b: Todo, sortOption: SortOption): number => {
  switch (sortOption) {
    case 'dueDate':
      // Sort by due date (no due date goes to end)
      if (!a.dueDate && !b.dueDate) return a.order - b.order;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
      
    case 'category':
      if (a.category === b.category) return a.order - b.order;
      return a.category.localeCompare(b.category);
      
    case 'created':
      return b.createdAt.getTime() - a.createdAt.getTime();
      
    case 'alphabetical':
      return a.title.localeCompare(b.title);
      
    case 'manual':
    default:
      return a.order - b.order;
  }
};

export const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const categories: Category[] = ['ML', 'GATE', 'Projects', 'Personal', 'Work'];

export const getCategoryIcon = (category: Category): string => {
  const icons = {
    ML: '🤖',
    GATE: '🎓',
    Projects: '💻',
    Personal: '👤',
    Work: '💼'
  };
  return icons[category];
};