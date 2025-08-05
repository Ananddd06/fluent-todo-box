import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { FilterBar } from '@/components/FilterBar';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    todos,
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
  } = useTodos();

  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (title: string, description: string, category: any, dueDate?: Date) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title,
        description,
        category,
        dueDate
      });
      toast({
        title: "Todo updated",
        description: "Your todo has been successfully updated.",
      });
    } else {
      addTodo(title, description, category, dueDate);
      toast({
        title: "Todo created",
        description: "Your new todo has been added to the list.",
      });
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    toast({
      title: "Todo deleted",
      description: "The todo has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toggleTodo(id);
      toast({
        title: todo.completed ? "Todo marked as pending" : "Todo completed",
        description: todo.completed 
          ? "Keep up the great work!" 
          : "Great job on completing that task!",
      });
    }
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast({
      title: "Completed todos cleared",
      description: `Removed ${stats.completed} completed todos.`,
    });
  };

  const taskCounts = {
    total: stats.total,
    pending: stats.pending,
    completed: stats.completed,
    overdue: stats.overdue
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header
        onAddTodo={handleAddTodo}
        onClearCompleted={handleClearCompleted}
        onExport={exportTodos}
        stats={stats}
      />

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Statistics */}
          <StatsCard stats={stats} />

          {/* Filters */}
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
            taskCounts={taskCounts}
          />

          {/* Todo List */}
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onReorder={reorderTodos}
          />
        </div>
      </main>

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleFormSubmit}
        editingTodo={editingTodo}
      />
    </div>
  );
};

export default Index;
