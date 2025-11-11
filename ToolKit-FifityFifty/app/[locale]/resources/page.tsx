import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { fetchPhases } from '@/lib/cms-client';
import { ResourceLibraryClient } from './ResourceLibraryClient';
import { Metadata } from 'next';

/**
 * Resource Library Page
 * 
 * Displays all resources from all phases and modules
 * with filtering and search capabilities
 */

interface ResourcesPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: ResourcesPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Resources' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function ResourcesPage({ params: { locale } }: ResourcesPageProps) {
  setRequestLocale(locale);

  // Fetch all phases with modules and resources
  const phases = await fetchPhases(locale as 'en' | 'ar');

  const t = await getTranslations('Resources');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {t('pageTitle')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('pageDescription')}
        </p>
      </div>

      {/* Client Component with Interactive Features */}
      <ResourceLibraryClient phases={phases} locale={locale} />
    </div>
  );
}

