import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { TodoStats } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getCategoryIcon } from '@/utils/todoUtils';

interface StatsCardProps {
  stats: TodoStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const mostActiveCategoryEntry = Object.entries(stats.byCategory).reduce((a, b) => 
    stats.byCategory[a[0] as keyof typeof stats.byCategory] > stats.byCategory[b[0] as keyof typeof stats.byCategory] ? a : b
  );
  const mostActiveCategory = mostActiveCategoryEntry[0];
  const mostActiveCategoryCount = mostActiveCategoryEntry[1];

  return (
    <Card className="shadow-soft mb-4 sm:mb-6">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Overall progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-success/10 rounded-lg border border-success/20">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm sm:text-lg font-semibold text-success">{stats.completed}</div>
              <div className="text-xs text-success/80">Completed</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-3 bg-warning/10 rounded-lg border border-warning/20">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm sm:text-lg font-semibold text-warning">{stats.pending}</div>
              <div className="text-xs text-warning/80">Pending</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm sm:text-lg font-semibold text-destructive">{stats.overdue}</div>
              <div className="text-xs text-destructive/80">Overdue</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm sm:text-lg font-semibold text-primary">{stats.total}</div>
              <div className="text-xs text-primary/80">Total</div>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        {stats.total > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Tasks by Category</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                count > 0 && (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="text-xs"
                  >
                    {getCategoryIcon(category as keyof typeof stats.byCategory)} {category}: {count}
                  </Badge>
                )
              ))}
            </div>
            
            {mostActiveCategoryCount > 0 && (
              <div className="text-xs text-muted-foreground">
                Most active: {getCategoryIcon(mostActiveCategory as keyof typeof stats.byCategory)} {mostActiveCategory} ({mostActiveCategoryCount} tasks)
              </div>
            )}
          </div>
        )}

        {/* Motivational message */}
        {stats.total > 0 && (
          <div className="p-3 bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-lg border border-primary/10">
            <div className="text-sm text-primary">
              {stats.completed === stats.total 
                ? "🎉 Amazing! You've completed all your tasks!" 
                : stats.overdue > 0
                  ? `⚡ You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Time to catch up!`
                  : stats.pending === 1
                    ? "💪 Just one more task to go!"
                    : `🚀 Keep going! ${stats.pending} tasks remaining.`
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};