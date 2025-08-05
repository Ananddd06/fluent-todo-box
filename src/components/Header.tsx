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
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-hero rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">📝</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold gradient-primary bg-clip-text text-transparent truncate">
                TodoMaster
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {stats.total > 0 
                  ? `${stats.pending} of ${stats.total} remaining`
                  : 'Start your journey'
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Add todo button */}
            <Button 
              onClick={onAddTodo}
              size="default"
              className="shadow-soft hover:shadow-glow transition-all duration-200 h-9 sm:h-10"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Todo</span>
            </Button>

            {/* Theme toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-accent transition-smooth h-9 w-9 sm:h-10 sm:w-10"
            >
              {theme === 'light' ? (
                <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>

            {/* More actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="hover:bg-accent transition-smooth h-9 w-9 sm:h-10 sm:w-10"
                >
                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border border-border z-50">
                <DropdownMenuItem 
                  onClick={() => handleExport('json')}
                  disabled={isExporting || stats.total === 0}
                  className="focus:bg-accent"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('markdown')}
                  disabled={isExporting || stats.total === 0}
                  className="focus:bg-accent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onClearCompleted}
                  disabled={stats.completed === 0}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
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