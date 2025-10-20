/**
 * Structured Data Component
 * 
 * Implements US5.3 - SEO Implementation
 * Provides JSON-LD structured data for better search engine understanding
 */

interface StructuredDataProps {
  type: 'organization' | 'website' | 'breadcrumb';
  data?: {
    name?: string;
    description?: string;
    url?: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  };
  locale: 'en' | 'ar';
}

export function StructuredData({ type, data, locale }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolkit.fiftyfifty.org';

  let structuredData: Record<string, any> = {};

  switch (type) {
    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'FiftyFifty',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description:
          locale === 'ar'
            ? 'منظمة تعمل على بناء مجتمعات مستدامة من خلال المسؤولية الاجتماعية'
            : 'Building sustainable communities through social responsibility',
        sameAs: [
          'https://twitter.com/fiftyfifty',
          'https://facebook.com/fiftyfifty',
          'https://linkedin.com/company/fiftyfifty',
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
        },
      };
      break;

    case 'website':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data?.name || 'FiftyFifty ToolKit',
        url: data?.url || baseUrl,
        description:
          data?.description ||
          (locale === 'ar'
            ? 'منهجية شاملة ومنصة تعليمية لرواد الأعمال الاجتماعيين'
            : 'A comprehensive methodology and learning platform for social entrepreneurs'),
        inLanguage: locale === 'ar' ? 'ar' : 'en',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };
      break;

    case 'breadcrumb':
      if (data?.breadcrumbs && data.breadcrumbs.length > 0) {
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${baseUrl}${crumb.url}`,
          })),
        };
      }
      break;
  }

  if (Object.keys(structuredData).length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

