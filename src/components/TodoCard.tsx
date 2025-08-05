import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Edit2, Trash2, Check, X } from 'lucide-react';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDueDate, getCategoryColor, getCategoryIcon, isOverdue } from '@/utils/todoUtils';
import { cn } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  index,
  onToggle,
  onEdit,
  onDelete
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const overdue = todo.dueDate && isOverdue(todo.dueDate) && !todo.completed;

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-2 sm:mb-3 transition-all duration-200 hover:shadow-card group touch-manipulation",
            snapshot.isDragging && "shadow-glow scale-105 rotate-2",
            todo.completed && "opacity-75 bg-muted/50",
            overdue && "border-destructive/50 bg-destructive/5"
          )}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              {/* Completion checkbox */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onToggle(todo.id)}
                className={cn(
                  "mt-0.5 sm:mt-1 rounded-full transition-all duration-200 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0",
                  todo.completed 
                    ? "bg-success text-success-foreground hover:bg-success/80" 
                    : "hover:bg-primary/10 hover:text-primary"
                )}
              >
                {todo.completed ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-current rounded-full" />}
              </Button>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium text-sm sm:text-base leading-tight mb-1 sm:mb-2 transition-all duration-200",
                      todo.completed && "line-through text-muted-foreground"
                    )}>
                      {todo.title}
                    </h3>
                    
                    {/* Category and due date */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getCategoryColor(todo.category))}
                      >
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(todo.category)} 
                          <span className="hidden sm:inline">{todo.category}</span>
                        </span>
                      </Badge>
                      
                      {todo.dueDate && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            overdue && "border-destructive text-destructive"
                          )}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">{formatDueDate(todo.dueDate)}</span>
                          <span className="sm:hidden">{formatDueDate(todo.dueDate).split(' ')[0]}</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(todo)}
                      className="hover:bg-primary/10 hover:text-primary h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(todo.id)}
                      className="hover:bg-destructive/10 hover:text-destructive h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                {todo.description && (
                  <div className="mt-1 sm:mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDescription(!showDescription)}
                      className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {showDescription ? 'Hide' : 'Show'} description
                    </Button>
                    
                    {showDescription && (
                      <div className="mt-2 p-2 sm:p-3 bg-muted/50 rounded-lg border animate-fade-in">
                        <div className="text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>
                            {todo.description}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Creation date */}
                <div className="flex items-center gap-1 mt-1 sm:mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Created {todo.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};