'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Download, FileText, File, Sheet, X, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ResourceWithContext, ResourceFileType } from '@/lib/hooks/useResourceLibrary';

/**
 * Resource Card Component
 * 
 * Displays individual resource with download button
 */

interface ResourceCardProps {
  resource: ResourceWithContext;
  locale: string;
  onDownload?: (resourceId: number) => void;
  showContext?: boolean;
}

export function ResourceCard({
  resource,
  locale,
  onDownload,
  showContext = true,
}: ResourceCardProps) {
  const t = useTranslations('Resources');
  
  const fileUrl = resource.attributes.file?.data?.attributes.url || resource.attributes.file_url;
  const fileType = resource.attributes.file_type;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(resource.id);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors">
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {fileType === 'PDF' && <FileText className="w-8 h-8 text-red-500" />}
        {fileType === 'Excel' && <Sheet className="w-8 h-8 text-green-600" />}
        {fileType === 'Word' && <File className="w-8 h-8 text-blue-600" />}
        {fileType === 'Other' && <File className="w-8 h-8 text-gray-500" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {resource.attributes.title}
        </h3>
        
        {resource.attributes.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {resource.attributes.description}
          </p>
        )}

        {showContext && (
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{resource.phaseTitle}</span>
            <span>›</span>
            <span>{resource.moduleTitle}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3">
          {/* File Type Badge */}
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {fileType}
          </span>

          {/* File Size */}
          {resource.attributes.file_size && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {resource.attributes.file_size}
            </span>
          )}
        </div>
      </div>

      {/* Download Button */}
      {fileUrl && (
        <a
          href={fileUrl}
          download
          onClick={handleDownload}
          className={cn(
            'flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary text-white hover:bg-primary/90',
            'transition-colors text-sm font-medium'
          )}
        >
          <Download className="w-4 h-4" />
          {t('download')}
        </a>
      )}
    </div>
  );
}

/**
 * Resource Group Component
 * 
 * Groups resources with a header
 */

interface ResourceGroupProps {
  label: string;
  resources: ResourceWithContext[];
  locale: string;
  onDownload?: (resourceId: number) => void;
  showContext?: boolean;
}

export function ResourceGroup({
  label,
  resources,
  locale,
  onDownload,
  showContext,
}: ResourceGroupProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
        {label}
        <span className="ms-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          ({resources.length})
        </span>
      </h2>
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            locale={locale}
            onDownload={onDownload}
            showContext={showContext}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * File Type Filter Component
 */

interface FileTypeFilterProps {
  selectedType: ResourceFileType;
  onTypeChange: (type: ResourceFileType) => void;
  counts: Record<ResourceFileType, number>;
  locale: string;
}

export function FileTypeFilter({
  selectedType,
  onTypeChange,
  counts,
  locale,
}: FileTypeFilterProps) {
  const t = useTranslations('Resources');

  const types: ResourceFileType[] = ['all', 'PDF', 'Excel', 'Word', 'Other'];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const isSelected = selectedType === type;
        const count = counts[type] || 0;

        return (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
              isSelected
                ? 'bg-primary text-white border-primary'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary'
            )}
          >
            {type === 'all' ? t('allFiles') : type}
            <span className="ms-1.5 opacity-75">({count})</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Resource Search Input
 */

interface ResourceSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ResourceSearch({ value, onChange, placeholder }: ResourceSearchProps) {
  const t = useTranslations('Resources');

  return (
    <div className="relative">
      <SearchIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t('searchPlaceholder')}
        className={cn(
          'w-full ps-10 pe-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-500 dark:placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-colors'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

/**
 * Group By Selector
 */

interface GroupBySelectorProps {
  value: 'phase' | 'module' | 'type';
  onChange: (value: 'phase' | 'module' | 'type') => void;
  locale: string;
}

export function GroupBySelector({ value, onChange, locale }: GroupBySelectorProps) {
  const t = useTranslations('Resources');

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {t('groupBy')}:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'phase' | 'module' | 'type')}
        className={cn(
          'px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-colors text-sm'
        )}
      >
        <option value="phase">{t('byPhase')}</option>
        <option value="module">{t('byModule')}</option>
        <option value="type">{t('byFileType')}</option>
      </select>
    </div>
  );
}

