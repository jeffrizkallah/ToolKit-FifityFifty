'use client';

/**
 * Custom Error Page
 * 
 * Implements US3.11 - 404 & Error Pages
 * Handles runtime errors with helpful messaging and recovery options
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#EC1C24]/10 mb-6">
            <AlertCircle className="w-16 h-16 text-[#EC1C24]" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, we're logging these issues to fix them quickly.
          </p>
          
          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 text-left bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-sm text-red-600 overflow-x-auto">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={reset}
            size="lg"
            className="bg-[#0063AF] hover:bg-[#004a8a] text-white"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#0063AF] text-[#0063AF] hover:bg-[#0063AF] hover:text-white"
          >
            <Link href="/en" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What happened?
          </h3>
          <p className="text-gray-600 mb-4">
            An unexpected error occurred while loading this page. This has been logged and will be investigated.
          </p>
          <div className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <p className="text-sm font-semibold text-gray-700 mb-2">You can:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#0063AF] font-bold">•</span>
                <span>Try refreshing the page using the button above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0063AF] font-bold">•</span>
                <span>Return to the homepage and start over</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0063AF] font-bold">•</span>
                <span>If the problem persists, try again later</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

