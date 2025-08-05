import { useState, useEffect, useCallback } from 'react';
import { Todo, Category, FilterState, SortOption, TodoStats } from '@/types/todo';
import { generateId, isOverdue, sortTodos } from '@/utils/todoUtils';

const STORAGE_KEY = 'todos-app-data';

interface TodosData {
  todos: Todo[];
  lastId: number;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    status: 'all',
    dueDateFilter: 'all'
  });
  const [sortOption, setSortOption] = useState<SortOption>('manual');

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: TodosData = JSON.parse(stored);
        const todosWithDates = data.todos.map(todo => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
        setTodos(todosWithDates);
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    try {
      const data: TodosData = {
        todos,
        lastId: Math.max(...todos.map(t => parseInt(t.id, 10) || 0), 0)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }, [todos]);

  const createTodo = useCallback((
    title: string,
    description: string = '',
    category: Category,
    dueDate?: Date
  ): Todo => {
    const now = new Date();
    return {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate,
      completed: false,
      createdAt: now,
      updatedAt: now,
      order: todos.length
    };
  }, [todos.length]);

  const addTodo = useCallback((
    title: string,
    description?: string,
    category: Category = 'Personal',
    dueDate?: Date
  ) => {
    if (!title.trim()) return;
    
    const newTodo = createTodo(title, description, category, dueDate);
    setTodos(prev => [...prev, newTodo]);
  }, [createTodo]);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  }, []);

  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order property
      return result.map((todo, index) => ({
        ...todo,
        order: index,
        updatedAt: new Date()
      }));
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const exportTodos = useCallback((format: 'json' | 'markdown' = 'json') => {
    if (format === 'json') {
      return JSON.stringify(todos, null, 2);
    }
    
    // Markdown export
    const markdown = todos.map(todo => {
      const status = todo.completed ? '✅' : '❌';
      const dueDate = todo.dueDate ? ` (Due: ${todo.dueDate.toLocaleDateString()})` : '';
      return `${status} **${todo.title}** [${todo.category}]${dueDate}\n   ${todo.description || 'No description'}`;
    }).join('\n\n');
    
    return `# Todo List Export\n\n${markdown}`;
  }, [todos]);

  // Filtered and sorted todos
  const filteredTodos = todos
    .filter(todo => {
      // Category filter
      if (filter.category !== 'all' && todo.category !== filter.category) {
        return false;
      }
      
      // Status filter
      if (filter.status === 'completed' && !todo.completed) return false;
      if (filter.status === 'pending' && todo.completed) return false;
      
      // Due date filter
      if (filter.dueDateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        switch (filter.dueDateFilter) {
          case 'today':
            if (!todo.dueDate) return false;
            const todoDate = new Date(todo.dueDate.getFullYear(), todo.dueDate.getMonth(), todo.dueDate.getDate());
            return todoDate.getTime() === today.getTime();
          case 'week':
            if (!todo.dueDate) return false;
            return todo.dueDate >= today && todo.dueDate <= weekFromNow;
          case 'overdue':
            return todo.dueDate && isOverdue(todo.dueDate) && !todo.completed;
        }
      }
      
      return true;
    })
    .sort((a, b) => sortTodos(a, b, sortOption));

  // Statistics
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => t.dueDate && isOverdue(t.dueDate) && !t.completed).length,
    byCategory: {
      ML: todos.filter(t => t.category === 'ML').length,
      GATE: todos.filter(t => t.category === 'GATE').length,
      Projects: todos.filter(t => t.category === 'Projects').length,
      Personal: todos.filter(t => t.category === 'Personal').length,
      Work: todos.filter(t => t.category === 'Work').length,
    }
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    sortOption,
    setSortOption,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    clearCompleted,
    exportTodos,
    stats
  };
};