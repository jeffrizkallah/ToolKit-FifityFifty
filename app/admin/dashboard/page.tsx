'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ContentCounts {
  phases: number;
  modules: number;
  resources: number;
  testimonials: number;
}

const contentSections = [
  {
    id: 'settings',
    title: 'Site Settings',
    description: 'Edit site title, hero content, footer, and social links',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'phases',
    title: 'Phases',
    description: 'Manage the 6 campaign phases',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'modules',
    title: 'Modules',
    description: 'Edit learning modules within each phase',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Manage downloadable resources and files',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Edit participant testimonials and quotes',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'from-rose-500 to-rose-600',
  },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<ContentCounts>({ phases: 0, modules: 0, resources: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Check auth
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.replace('/admin');
          return;
        }

        // Load content counts
        const [phasesRes, modulesRes, resourcesRes, testimonialsRes] = await Promise.all([
          fetch('/api/admin/content?type=phases'),
          fetch('/api/admin/content?type=modules'),
          fetch('/api/admin/content?type=resources'),
          fetch('/api/admin/content?type=testimonials'),
        ]);

        const phasesData = await phasesRes.json();
        const modulesData = await modulesRes.json();
        const resourcesData = await resourcesRes.json();
        const testimonialsData = await testimonialsRes.json();

        setCounts({
          phases: phasesData.phases?.length || 0,
          modules: modulesData.modules?.length || 0,
          resources: resourcesData.resources?.length || 0,
          testimonials: testimonialsData.testimonials?.length || 0,
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.replace('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Management</h1>
          <p className="text-slate-400">FiftyFifty ToolKit Admin Panel</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            View Site →
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => (
          <Link
            key={section.id}
            href={`/admin/${section.id}`}
            className="group block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-white/20 hover:shadow-xl"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-white">{section.icon}</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{section.title}</h2>
            <p className="text-slate-400 text-sm mb-4">{section.description}</p>
            {section.id !== 'settings' && (
              <div className="text-sm text-slate-500">
                {counts[section.id as keyof ContentCounts] || 0} items
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Info */}
      <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• All content supports both English and Arabic translations</li>
          <li>• Changes are saved directly to JSON files in the <code className="px-2 py-0.5 bg-white/10 rounded">/content</code> directory</li>
          <li>• Rich text fields support HTML formatting</li>
          <li>• Remember to save your changes before navigating away</li>
        </ul>
      </div>
    </div>
  );
}

