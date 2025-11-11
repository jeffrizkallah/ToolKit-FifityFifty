'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from './button';
import { localeNames, getOppositeLocale, type Locale } from '@/i18n';
import { Languages } from 'lucide-react';

/**
 * LanguageToggle Component
 * 
 * A button that allows users to switch between English and Arabic.
 * Changes the locale without reloading the page by using client-side navigation.
 */

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as Locale;
  const oppositeLocale = getOppositeLocale(currentLocale);

  const handleLanguageSwitch = () => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    
    // Navigate to the same path with the opposite locale
    const newPath = `/${oppositeLocale}${pathWithoutLocale || ''}`;
    router.push(newPath);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLanguageSwitch}
      className="flex items-center gap-2"
      aria-label={`Switch to ${localeNames[oppositeLocale]}`}
    >
      <Languages className="h-4 w-4" />
      <span>{localeNames[oppositeLocale]}</span>
    </Button>
  );
}

