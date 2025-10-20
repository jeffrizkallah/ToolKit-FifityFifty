'use client';

import { useProgress } from '@/lib/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Module Completion Component
 * 
 * Displays completion status and allows users to mark modules as complete/incomplete
 */

interface ModuleCompletionProps {
  moduleId: number;
  variant?: 'button' | 'icon' | 'badge';
  className?: string;
}

export function ModuleCompletion({ 
  moduleId, 
  variant = 'button',
  className = ''
}: ModuleCompletionProps) {
  const { isModuleComplete, markModuleComplete, markModuleIncomplete } = useProgress();
  const t = useTranslations('Progress');
  const isComplete = isModuleComplete(moduleId);

  const handleToggle = () => {
    if (isComplete) {
      markModuleIncomplete(moduleId);
    } else {
      markModuleComplete(moduleId);
    }
  };

  // Icon only variant (for cards)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={`transition-colors ${className}`}
        aria-label={isComplete ? t('markIncomplete') : t('markComplete')}
      >
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        ) : (
          <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    );
  }

  // Badge variant (for small displays)
  if (variant === 'badge') {
    return isComplete ? (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full ${className}`}>
        <CheckCircle2 className="w-3 h-3" />
        {t('completed')}
      </span>
    ) : null;
  }

  // Button variant (default, for module pages)
  return (
    <Button
      onClick={handleToggle}
      variant={isComplete ? 'outline' : 'default'}
      className={`gap-2 ${className}`}
    >
      {isComplete ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          {t('markIncomplete')}
        </>
      ) : (
        <>
          <Circle className="w-5 h-5" />
          {t('markComplete')}
        </>
      )}
    </Button>
  );
}

/**
 * Module Completion Status Display
 * 
 * Simple display component showing completion status without interaction
 */
export function ModuleCompletionStatus({ moduleId }: { moduleId: number }) {
  const { isModuleComplete } = useProgress();
  const t = useTranslations('Progress');
  const isComplete = isModuleComplete(moduleId);

  if (!isComplete) return null;

  return (
    <div className="inline-flex items-center gap-2 text-green-600">
      <CheckCircle2 className="w-5 h-5" />
      <span className="text-sm font-medium">{t('completed')}</span>
    </div>
  );
}

