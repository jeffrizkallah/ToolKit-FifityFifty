'use client';

import { useProgress } from '@/lib/contexts/ProgressContext';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from 'next-intl';
import { Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Progress Indicator Component
 * 
 * Displays user's overall progress with visual progress bar
 * Shows percentage and fraction of completed modules
 */

interface ProgressIndicatorProps {
  totalModules: number;
  variant?: 'full' | 'compact' | 'minimal';
  showCelebration?: boolean;
  className?: string;
}

export function ProgressIndicator({ 
  totalModules,
  variant = 'full',
  showCelebration = true,
  className = ''
}: ProgressIndicatorProps) {
  const { getCompletedCount, getCompletionPercentage } = useProgress();
  const t = useTranslations('Progress');
  
  const completedCount = getCompletedCount();
  const percentage = getCompletionPercentage(totalModules);
  const isComplete = completedCount === totalModules && totalModules > 0;
  const isHalfway = percentage >= 50 && !isComplete;

  // Minimal variant - just the progress bar
  if (variant === 'minimal') {
    return (
      <div className={cn('space-y-1', className)}>
        <Progress value={percentage} className="h-1.5" />
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {percentage}%
        </p>
      </div>
    );
  }

  // Compact variant - progress bar with inline text
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t('yourProgress')}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {completedCount}/{totalModules}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  }

  // Full variant - complete display with celebration
  return (
    <div className={cn('space-y-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {t('yourProgress')}
          </h3>
        </div>
        {isComplete && showCelebration && (
          <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
        )}
      </div>

      {/* Progress Stats */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">
          {percentage}%
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('completedModules', { count: completedCount, total: totalModules })}
        </span>
      </div>

      {/* Progress Bar */}
      <Progress value={percentage} className="h-3" />

      {/* Celebration Messages */}
      {showCelebration && (
        <>
          {isComplete && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  {t('congratulations')}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('allComplete')}
                </p>
              </div>
            </div>
          )}
          {isHalfway && (
            <p className="text-sm text-primary font-medium text-center">
              🎯 {t('percentComplete', { percent: percentage })}
            </p>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Progress Summary Component
 * 
 * Compact display for sidebar or header
 */
export function ProgressSummary({ 
  totalModules,
  className = ''
}: { 
  totalModules: number;
  className?: string;
}) {
  const { getCompletedCount } = useProgress();
  
  const completedCount = getCompletedCount();

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Target className="w-4 h-4 text-primary" />
      <span className="text-gray-700 dark:text-gray-300">
        <span className="font-semibold text-primary">{completedCount}</span>
        <span className="text-gray-500 dark:text-gray-400">/{totalModules}</span>
      </span>
    </div>
  );
}

