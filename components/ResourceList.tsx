'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Resource } from '@/lib/types/cms';
import { trackDownload } from '@/lib/analytics';

interface ResourceListProps {
  resources: Resource[];
  locale: 'en' | 'ar';
  moduleSlug?: string;
  className?: string;
}

/**
 * ResourceList Component
 * 
 * Displays a list of downloadable resources with:
 * - File type icons and badges
 * - File size display
 * - Download buttons
 * - Analytics tracking for downloads
 * - Bilingual support
 */
export default function ResourceList({
  resources,
  locale,
  moduleSlug = '',
  className = '',
}: ResourceListProps) {
  // Helper function to get file icon based on type
  const getFileIcon = (fileType: string) => {
    const iconClass = 'h-5 w-5';
    
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-600`} />;
      case 'excel':
        return <FileSpreadsheet className={`${iconClass} text-green-600`} />;
      case 'word':
        return <FileText className={`${iconClass} text-blue-600`} />;
      default:
        return <File className={iconClass} />;
    }
  };

  // Helper function to get file type badge color
  const getFileTypeBadgeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'excel':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'word':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Handle download button click with analytics tracking
  const handleDownload = (resource: Resource) => {
    // Track download event with GA4 (no PII)
    trackDownload(
      resource.attributes.title,
      resource.attributes.file_type,
      moduleSlug
    );
  };

  // Get media URL helper
  const getMediaUrl = (url: string | undefined) => {
    if (!url) return '';
    
    // If URL is already absolute, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If relative, prepend CMS base URL
    const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || process.env.CMS_BASE_URL || '';
    return `${cmsBaseUrl}${url}`;
  };

  // Text translations
  const translations = {
    en: {
      title: 'Downloadable Resources',
      download: 'Download',
      noResources: 'No resources available for this module.',
    },
    ar: {
      title: 'الموارد القابلة للتنزيل',
      download: 'تنزيل',
      noResources: 'لا توجد موارد متاحة لهذه الوحدة.',
    },
  };

  const t = translations[locale];

  // If no resources, show message
  if (!resources || resources.length === 0) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">{t.noResources}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t.title}
          </h2>
          
          <div className="grid gap-4">
            {resources.map((resource) => {
              // Get file URL from either file_url or file.data
              const fileUrl = resource.attributes.file_url || 
                getMediaUrl(resource.attributes.file?.data?.attributes.url);
              
              if (!fileUrl) return null; // Skip resources without valid file URL

              return (
                <Card 
                  key={resource.id} 
                  className="p-6 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Resource Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title with Icon */}
                      <div className="flex items-center gap-3 mb-2">
                        {getFileIcon(resource.attributes.file_type)}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {resource.attributes.title}
                        </h3>
                      </div>

                      {/* Description */}
                      {resource.attributes.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {resource.attributes.description}
                        </p>
                      )}

                      {/* Metadata: File Type & Size */}
                      <div className="flex items-center gap-3 text-sm">
                        <span 
                          className={`px-2.5 py-1 rounded border font-medium ${getFileTypeBadgeColor(resource.attributes.file_type)}`}
                        >
                          {resource.attributes.file_type}
                        </span>
                        
                        {resource.attributes.file_size && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {resource.attributes.file_size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Download Button */}
                    <Button
                      asChild
                      className="bg-[#0063AF] hover:bg-[#004a8a] text-white shrink-0"
                      onClick={() => handleDownload(resource)}
                    >
                      <a 
                        href={fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileDown className="h-4 w-4" />
                        <span className="hidden sm:inline">{t.download}</span>
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
