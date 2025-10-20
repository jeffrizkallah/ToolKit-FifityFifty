import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

/**
 * Custom 404 Not Found Page
 * 
 * Implements US3.11 - 404 & Error Pages
 * Displays a helpful message when users navigate to a non-existent page
 */

export default function NotFoundPage() {
  // Note: We can't use useParams() here since this is a special Next.js page
  // Default to English if locale detection fails
  const locale = 'en';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#0063AF]/10 mb-6">
            <Search className="w-16 h-16 text-[#0063AF]" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-[#0063AF] hover:bg-[#004a8a] text-white"
          >
            <Link href="/en" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#0063AF] text-[#0063AF] hover:bg-[#0063AF] hover:text-white"
          >
            <Link href="/ar">
              الصفحة الرئيسية
            </Link>
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What you can do:
          </h3>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-[#0063AF] font-bold">•</span>
              <span>Check the URL for any typos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0063AF] font-bold">•</span>
              <span>Return to the homepage and navigate from there</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0063AF] font-bold">•</span>
              <span>Explore the six phases of the FiftyFifty ToolKit</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

