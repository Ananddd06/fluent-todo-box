import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { Todo, Category } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { categories, getCategoryIcon } from '@/utils/todoUtils';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, category: Category, dueDate?: Date) => void;
  editingTodo?: Todo | null;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTodo
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Reset form when dialog opens/closes or editing todo changes
  useEffect(() => {
    if (isOpen) {
      if (editingTodo) {
        setTitle(editingTodo.title);
        setDescription(editingTodo.description);
        setCategory(editingTodo.category);
        setDueDate(editingTodo.dueDate);
      } else {
        setTitle('');
        setDescription('');
        setCategory('Personal');
        setDueDate(undefined);
      }
    }
  }, [isOpen, editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit(title, description, category, dueDate);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('Personal');
    setDueDate(undefined);
    setIsDatePickerOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingTodo ? (
              <>
                <Edit3 className="h-5 w-5 text-primary" />
                Edit Todo
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Create New Todo
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {editingTodo 
              ? 'Update your todo details below.' 
              : 'Fill in the details for your new todo item.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-smooth focus:shadow-soft"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details... (Markdown supported)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] transition-smooth focus:shadow-soft resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                <SelectTrigger className="transition-smooth focus:shadow-soft">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        {getCategoryIcon(cat)} {cat}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-smooth hover:shadow-soft",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM dd, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                  {dueDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDueDate(undefined);
                          setIsDatePickerOpen(false);
                        }}
                        className="w-full"
                      >
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim()}
              className="transition-bounce"
            >
              {editingTodo ? 'Update Todo' : 'Create Todo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};