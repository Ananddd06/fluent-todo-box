import React, { useState } from 'react';
import { 
  Plus, 
  Moon, 
  Sun, 
  Download, 
  Trash2, 
  MoreVertical,
  FileText,
  FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { downloadFile } from '@/utils/todoUtils';
import { TodoStats } from '@/types/todo';

interface HeaderProps {
  onAddTodo: () => void;
  onClearCompleted: () => void;
  onExport: (format: 'json' | 'markdown') => string;
  stats: TodoStats;
}

export const Header: React.FC<HeaderProps> = ({
  onAddTodo,
  onClearCompleted,
  onExport,
  stats
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'json' | 'markdown') => {
    setIsExporting(true);
    try {
      const content = onExport(format);
      const filename = `todos-${new Date().toISOString().split('T')[0]}.${format === 'json' ? 'json' : 'md'}`;
      downloadFile(content, filename, format === 'json' ? 'application/json' : 'text/markdown');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-md mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">📝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                TodoMaster
              </h1>
              <p className="text-sm text-muted-foreground">
                {stats.total > 0 
                  ? `${stats.pending} of ${stats.total} tasks remaining`
                  : 'Start your productivity journey'
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Add todo button */}
            <Button 
              onClick={onAddTodo}
              size="lg"
              className="shadow-soft hover:shadow-glow transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>

            {/* Theme toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent transition-smooth"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* More actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="hover:bg-accent transition-smooth"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => handleExport('json')}
                  disabled={isExporting || stats.total === 0}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('markdown')}
                  disabled={isExporting || stats.total === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onClearCompleted}
                  disabled={stats.completed === 0}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Completed ({stats.completed})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};