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
  isNew?: boolean; // Track if this is a newly added module
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
      // Separate new modules from existing ones
      const existingModules = modules.filter(m => !m.isNew);
      const newModules = modules.filter(m => m.isNew);

      // Update existing modules
      if (existingModules.length > 0) {
        const updateRes = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'modules', data: { modules: existingModules } }),
        });

        if (!updateRes.ok) {
          const data = await updateRes.json();
          setMessage({ type: 'error', text: data.error || 'Failed to update modules' });
          setSaving(false);
          return;
        }
      }

      // Create new modules
      for (const module of newModules) {
        const createRes = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'modules', data: module }),
        });

        if (!createRes.ok) {
          const data = await createRes.json();
          setMessage({ type: 'error', text: data.error || 'Failed to create module' });
          setSaving(false);
          return;
        }
      }

      // Reload data to get updated IDs
      const modulesRes = await fetch('/api/admin/content?type=modules');
      if (modulesRes.ok) {
        const data = await modulesRes.json();
        setModules(data.modules || []);
      }

      setMessage({ type: 'success', text: 'Modules saved successfully!' });
      setEditingId(null);
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

  const addModule = () => {
    const newId = -Date.now(); // Use negative timestamp as temporary ID
    const firstPhase = phases.sort((a, b) => a.phase_number - b.phase_number)[0];
    
    const newModule: Module = {
      id: newId,
      title: 'New Module',
      title_ar: 'وحدة جديدة',
      slug: `new-module-${Math.random().toString(36).substring(7)}`,
      summary: '',
      summary_ar: '',
      video_url: '',
      video_subtitle_url_en: '',
      video_subtitle_url_ar: '',
      key_takeaways: '',
      key_takeaways_ar: '',
      order: modules.filter(m => m.phase_id === firstPhase?.id).length + 1,
      phase_id: firstPhase?.id || 1,
      isNew: true,
    };

    setModules([...modules, newModule]);
    setEditingId(newId);
  };

  const deleteModule = async (id: number, isNew: boolean) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all associated resources.')) {
      return;
    }

    if (isNew) {
      // Just remove from local state
      setModules(modules.filter(m => m.id !== id));
    } else {
      // Delete from database
      try {
        const res = await fetch(`/api/admin/content?type=modules&id=${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setModules(modules.filter(m => m.id !== id));
          setMessage({ type: 'success', text: 'Module deleted successfully!' });
        } else {
          const data = await res.json();
          setMessage({ type: 'error', text: data.error || 'Failed to delete module' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'An error occurred while deleting' });
      }
    }
  };

  const getPhaseTitle = (phaseId: number) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase ? `Phase ${phase.phase_number}: ${phase.title}` : 'Unknown Phase';
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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
            <p className="text-slate-400">Manage learning modules and their videos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addModule}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Module
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
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

      {/* Stats Bar */}
      <div className="mb-6 flex items-center gap-4 text-sm text-slate-400">
        <span>{filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''}</span>
        <span>•</span>
        <span>{filteredModules.filter(m => m.video_url).length} with videos</span>
        {modules.some(m => m.isNew) && (
          <>
            <span>•</span>
            <span className="text-amber-400">{modules.filter(m => m.isNew).length} unsaved new module{modules.filter(m => m.isNew).length !== 1 ? 's' : ''}</span>
          </>
        )}
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {filteredModules.sort((a, b) => a.phase_id - b.phase_id || a.order - b.order).map((module) => (
          <div
            key={module.id}
            className={`bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden ${module.isNew ? 'border-amber-500/50' : 'border-white/10'}`}
          >
            {/* Module Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setEditingId(editingId === module.id ? null : module.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${module.isNew ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'}`}>
                  {module.order}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{module.title}</h3>
                    {module.isNew && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">New</span>
                    )}
                    {module.video_url && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Video
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{getPhaseTitle(module.phase_id)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteModule(module.id, module.isNew || false); }}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                  title="Delete module"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${editingId === module.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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
                      onChange={(e) => {
                        updateModule(module.id, 'title', e.target.value);
                        if (module.isNew) {
                          updateModule(module.id, 'slug', generateSlug(e.target.value));
                        }
                      }}
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

                {/* Video Section */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h4 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Video URL (YouTube/Vimeo)</label>
                      <input
                        type="url"
                        value={module.video_url}
                        onChange={(e) => updateModule(module.id, 'video_url', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle URL (English)</label>
                      <input
                        type="url"
                        value={module.video_subtitle_url_en}
                        onChange={(e) => updateModule(module.id, 'video_subtitle_url_en', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle URL (Arabic)</label>
                      <input
                        type="url"
                        value={module.video_subtitle_url_ar}
                        onChange={(e) => updateModule(module.id, 'video_subtitle_url_ar', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                      />
                    </div>
                  </div>
                  {module.video_url && (
                    <p className="mt-2 text-xs text-blue-400/70">
                      This video will appear in the video carousel on the phase page.
                    </p>
                  )}
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

        {filteredModules.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No modules found. Click &quot;Add Module&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
