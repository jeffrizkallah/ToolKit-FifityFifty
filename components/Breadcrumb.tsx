'use client';

/**
 * Breadcrumb Component
 * 
 * Implements US3.10 - Breadcrumb Navigation
 * Displays hierarchical navigation path: Home > Phase > Module
 * Fully supports RTL with proper chevron direction
 */

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
}

export function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const isRTL = locale === 'ar';
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav 
      className="flex items-center gap-2 text-sm"
      aria-label={isRTL ? 'مسار التنقل' : 'Breadcrumb navigation'}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.isCurrentPage || isLast;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Breadcrumb Item */}
            {isCurrent ? (
              <span 
                className="text-gray-900 font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link 
                href={item.href}
                className="text-gray-600 hover:text-[#0063AF] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}

            {/* Separator */}
            {!isLast && (
              <ChevronIcon 
                className="h-4 w-4 text-gray-400" 
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

