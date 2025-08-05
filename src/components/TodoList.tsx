import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Todo } from '@/types/todo';
import { TodoCard } from './TodoCard';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onReorder
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    
    onReorder(result.source.index, result.destination.index);
  };

  if (todos.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No todos found</h3>
          <p className="text-sm text-muted-foreground">
            Create your first todo or adjust your filters to see tasks here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg p-2' : ''
            }`}
          >
            {todos.map((todo, index) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                index={index}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};