import React from 'react';
import { Filter, Calendar, CheckCircle, Clock, SortAsc } from 'lucide-react';
import { FilterState, SortOption, Category } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories, getCategoryIcon } from '@/utils/todoUtils';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  taskCounts: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  sortOption,
  onSortChange,
  taskCounts
}) => {
  const hasActiveFilters = 
    filter.category !== 'all' || 
    filter.status !== 'all' || 
    filter.dueDateFilter !== 'all';

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      status: 'all',
      dueDateFilter: 'all'
    });
  };

  return (
    <Card className="shadow-soft mb-4 sm:mb-6">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Filter title and stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Filters & Sort</h3>
              {hasActiveFilters && (
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>{taskCounts.total} total</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-warning">{taskCounts.pending} pending</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-success">{taskCounts.completed} done</span>
              {taskCounts.overdue > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-destructive">{taskCounts.overdue} overdue</span>
                </>
              )}
            </div>
          </div>

          {/* Filter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Category filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select 
                value={filter.category} 
                onValueChange={(value) => onFilterChange({ ...filter, category: value as Category | 'all' })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Categories</SelectItem>
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

            {/* Status filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select 
                value={filter.status} 
                onValueChange={(value) => onFilterChange({ ...filter, status: value as 'all' | 'pending' | 'completed' })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Filter className="h-3 w-3" />
                      All Tasks
                    </span>
                  </SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due date filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Due Date</label>
              <Select 
                value={filter.dueDateFilter} 
                onValueChange={(value) => onFilterChange({ ...filter, dueDateFilter: value as 'all' | 'today' | 'week' | 'overdue' })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Due Today
                    </span>
                  </SelectItem>
                  <SelectItem value="week">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Due This Week
                    </span>
                  </SelectItem>
                  <SelectItem value="overdue">
                    <span className="flex items-center gap-2 text-destructive">
                      <Clock className="h-3 w-3" />
                      Overdue
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort option */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Sort By</label>
              <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="manual">
                    <span className="flex items-center gap-2">
                      <SortAsc className="h-3 w-3" />
                      Manual Order
                    </span>
                  </SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};