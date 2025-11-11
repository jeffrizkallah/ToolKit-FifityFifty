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
      className="flex items-center gap-2.5 text-sm font-medium"
      aria-label={isRTL ? 'مسار التنقل' : 'Breadcrumb navigation'}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.isCurrentPage || isLast;

        return (
          <div key={index} className="flex items-center gap-2.5">
            {/* Breadcrumb Item */}
            {isCurrent ? (
              <span 
                className="text-[#0041A8] font-semibold"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link 
                href={item.href}
                className="text-neutral-600 hover:text-[#0041A8] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-600">{item.label}</span>
            )}

            {/* Separator */}
            {!isLast && (
              <ChevronIcon 
                className="h-4 w-4 text-neutral-400" 
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

