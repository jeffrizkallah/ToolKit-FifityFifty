'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Phase {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  order: number;
  phase_number: number;
  header_video_url: string;
}

export default function PhasesPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPhases = async () => {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.replace('/admin');
          return;
        }

        const res = await fetch('/api/admin/content?type=phases');
        if (res.ok) {
          const data = await res.json();
          setPhases(data.phases || []);
        }
      } catch (error) {
        console.error('Error loading phases:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPhases();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'phases', data: { phases } }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Phases saved successfully!' });
        setEditingId(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save phases' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const updatePhase = (id: number, field: keyof Phase, value: string | number) => {
    setPhases(phases.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addPhase = () => {
    const newId = Math.max(...phases.map(p => p.id), 0) + 1;
    const newPhaseNumber = Math.max(...phases.map(p => p.phase_number), 0) + 1;
    const newOrder = Math.max(...phases.map(p => p.order), 0) + 1;
    setPhases([
      ...phases,
      {
        id: newId,
        title: `New Phase ${newPhaseNumber}`,
        title_ar: `المرحلة الجديدة ${newPhaseNumber}`,
        slug: `phase-${newPhaseNumber}`,
        description: '',
        description_ar: '',
        order: newOrder,
        phase_number: newPhaseNumber,
        header_video_url: '',
      },
    ]);
    setEditingId(newId);
  };

  const deletePhase = async (id: number) => {
    const phase = phases.find(p => p.id === id);
    if (!phase) return;
    
    if (!confirm(`Are you sure you want to delete "${phase.title}"? This will also delete all modules and resources within this phase. This action cannot be undone.`)) {
      return;
    }

    try {
      // Check if this phase exists in the database (not just locally added)
      const existingPhases = await fetch('/api/admin/content?type=phases').then(r => r.json());
      const existsInDb = existingPhases.phases?.some((p: Phase) => p.id === id);

      if (existsInDb) {
        // Delete from database
        const res = await fetch(`/api/admin/content?type=phases&id=${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const data = await res.json();
          setMessage({ type: 'error', text: data.error || 'Failed to delete phase' });
          return;
        }
      }

      // Remove from local state
      setPhases(phases.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Phase deleted successfully!' });
      
      if (editingId === id) {
        setEditingId(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while deleting' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading phases...</div>
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Phases</h1>
            <p className="text-gray-500">Manage campaign phases</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addPhase}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 transition-colors"
          >
            + Add Phase
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-[#0063AF] to-[#0041A8] hover:from-[#0041A8] hover:to-[#003080] text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Phases List */}
      <div className="space-y-4">
        {phases.sort((a, b) => a.order - b.order).map((phase) => (
          <div
            key={phase.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Phase Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setEditingId(editingId === phase.id ? null : phase.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {phase.phase_number}
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">{phase.title}</h3>
                  <p className="text-gray-500 text-sm">{phase.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deletePhase(phase.id); }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                  title="Delete phase"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${editingId === phase.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Edit Form */}
            {editingId === phase.id && (
              <div className="p-6 border-t border-gray-200 space-y-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => updatePhase(phase.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={phase.title_ar}
                      onChange={(e) => updatePhase(phase.id, 'title_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <input
                      type="text"
                      value={phase.slug}
                      onChange={(e) => updatePhase(phase.id, 'slug', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      value={phase.order}
                      onChange={(e) => updatePhase(phase.id, 'order', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phase Number</label>
                    <input
                      type="number"
                      value={phase.phase_number}
                      onChange={(e) => updatePhase(phase.id, 'phase_number', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header Video URL</label>
                  <input
                    type="url"
                    value={phase.header_video_url}
                    onChange={(e) => updatePhase(phase.id, 'header_video_url', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (English) - HTML</label>
                    <textarea
                      value={phase.description}
                      onChange={(e) => updatePhase(phase.id, 'description', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0063AF] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic) - HTML</label>
                    <textarea
                      dir="rtl"
                      value={phase.description_ar}
                      onChange={(e) => updatePhase(phase.id, 'description_ar', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0063AF] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {phases.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No phases found. Click &quot;Add Phase&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
