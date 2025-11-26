'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Module {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  summary: string;
  summary_ar: string;
  video_url: string;
  video_subtitle_url_en: string;
  video_subtitle_url_ar: string;
  key_takeaways: string;
  key_takeaways_ar: string;
  order: number;
  phase_id: number;
}

interface Phase {
  id: number;
  title: string;
  phase_number: number;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterPhase, setFilterPhase] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.replace('/admin');
          return;
        }

        const [modulesRes, phasesRes] = await Promise.all([
          fetch('/api/admin/content?type=modules'),
          fetch('/api/admin/content?type=phases'),
        ]);

        if (modulesRes.ok) {
          const data = await modulesRes.json();
          setModules(data.modules || []);
        }
        if (phasesRes.ok) {
          const data = await phasesRes.json();
          setPhases(data.phases || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'modules', data: { modules } }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Modules saved successfully!' });
        setEditingId(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save modules' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const updateModule = (id: number, field: keyof Module, value: string | number) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const getPhaseTitle = (phaseId: number) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase ? `Phase ${phase.phase_number}: ${phase.title}` : 'Unknown Phase';
  };

  const filteredModules = filterPhase 
    ? modules.filter(m => m.phase_id === filterPhase)
    : modules;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading modules...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Modules</h1>
            <p className="text-slate-400">Edit learning modules within each phase</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </header>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterPhase || ''}
          onChange={(e) => setFilterPhase(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
        >
          <option value="">All Phases</option>
          {phases.sort((a, b) => a.phase_number - b.phase_number).map((phase) => (
            <option key={phase.id} value={phase.id}>
              Phase {phase.phase_number}: {phase.title}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {filteredModules.sort((a, b) => a.phase_id - b.phase_id || a.order - b.order).map((module) => (
          <div
            key={module.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Module Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setEditingId(editingId === module.id ? null : module.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {module.order}
                </div>
                <div>
                  <h3 className="text-white font-medium">{module.title}</h3>
                  <p className="text-slate-400 text-sm">{getPhaseTitle(module.phase_id)}</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-slate-400 transition-transform ${editingId === module.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Edit Form */}
            {editingId === module.id && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title (English)</label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={module.title_ar}
                      onChange={(e) => updateModule(module.id, 'title_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
                    <input
                      type="text"
                      value={module.slug}
                      onChange={(e) => updateModule(module.id, 'slug', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                    <input
                      type="number"
                      value={module.order}
                      onChange={(e) => updateModule(module.id, 'order', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phase</label>
                    <select
                      value={module.phase_id}
                      onChange={(e) => updateModule(module.id, 'phase_id', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    >
                      {phases.sort((a, b) => a.phase_number - b.phase_number).map((phase) => (
                        <option key={phase.id} value={phase.id}>
                          Phase {phase.phase_number}: {phase.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Summary (English)</label>
                    <textarea
                      value={module.summary}
                      onChange={(e) => updateModule(module.id, 'summary', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Summary (Arabic)</label>
                    <textarea
                      dir="rtl"
                      value={module.summary_ar}
                      onChange={(e) => updateModule(module.id, 'summary_ar', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Video URL</label>
                    <input
                      type="url"
                      value={module.video_url}
                      onChange={(e) => updateModule(module.id, 'video_url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle URL (EN)</label>
                    <input
                      type="url"
                      value={module.video_subtitle_url_en}
                      onChange={(e) => updateModule(module.id, 'video_subtitle_url_en', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle URL (AR)</label>
                    <input
                      type="url"
                      value={module.video_subtitle_url_ar}
                      onChange={(e) => updateModule(module.id, 'video_subtitle_url_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Key Takeaways (English) - HTML</label>
                    <textarea
                      value={module.key_takeaways}
                      onChange={(e) => updateModule(module.id, 'key_takeaways', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Key Takeaways (Arabic) - HTML</label>
                    <textarea
                      dir="rtl"
                      value={module.key_takeaways_ar}
                      onChange={(e) => updateModule(module.id, 'key_takeaways_ar', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

