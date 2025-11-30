'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Resource {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  file_url: string;
  file_type: 'PDF' | 'Excel' | 'Word' | 'Other';
  file_size: string;
  order: number;
  module_id: number;
  isNew?: boolean;
}

interface Module {
  id: number;
  title: string;
  phase_id: number;
}

interface Phase {
  id: number;
  title: string;
  phase_number: number;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterModule, setFilterModule] = useState<number | null>(null);
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

        const [resourcesRes, modulesRes, phasesRes] = await Promise.all([
          fetch('/api/admin/content?type=resources'),
          fetch('/api/admin/content?type=modules'),
          fetch('/api/admin/content?type=phases'),
        ]);

        if (resourcesRes.ok) {
          const data = await resourcesRes.json();
          setResources(data.resources || []);
        }
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
      const existingResources = resources.filter(r => !r.isNew);
      const newResources = resources.filter(r => r.isNew);

      if (existingResources.length > 0) {
        const updateRes = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'resources', data: { resources: existingResources } }),
        });

        if (!updateRes.ok) {
          const data = await updateRes.json();
          setMessage({ type: 'error', text: data.error || 'Failed to update resources' });
          setSaving(false);
          return;
        }
      }

      for (const resource of newResources) {
        const createRes = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'resources', data: resource }),
        });

        if (!createRes.ok) {
          const data = await createRes.json();
          setMessage({ type: 'error', text: data.error || 'Failed to create resource' });
          setSaving(false);
          return;
        }
      }

      const resourcesRes = await fetch('/api/admin/content?type=resources');
      if (resourcesRes.ok) {
        const data = await resourcesRes.json();
        setResources(data.resources || []);
      }

      setMessage({ type: 'success', text: 'Resources saved successfully!' });
      setEditingId(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const updateResource = (id: number, field: keyof Resource, value: string | number) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const addResource = () => {
    const newId = -Date.now();
    const firstModule = modules[0];
    
    const newResource: Resource = {
      id: newId,
      title: 'New Resource',
      title_ar: 'مورد جديد',
      description: '',
      description_ar: '',
      file_url: '',
      file_type: 'PDF',
      file_size: '',
      order: resources.filter(r => r.module_id === firstModule?.id).length + 1,
      module_id: firstModule?.id || 1,
      isNew: true,
    };

    setResources([...resources, newResource]);
    setEditingId(newId);
  };

  const deleteResource = async (id: number, isNew: boolean) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    if (isNew) {
      setResources(resources.filter(r => r.id !== id));
    } else {
      try {
        const res = await fetch(`/api/admin/content?type=resources&id=${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setResources(resources.filter(r => r.id !== id));
          setMessage({ type: 'success', text: 'Resource deleted successfully!' });
        } else {
          const data = await res.json();
          setMessage({ type: 'error', text: data.error || 'Failed to delete resource' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'An error occurred while deleting' });
      }
    }
  };

  const getModuleTitle = (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 'Unknown Module';
    const phase = phases.find(p => p.id === module.phase_id);
    return phase ? `${module.title} (Phase ${phase.phase_number})` : module.title;
  };

  let filteredResources = resources;
  if (filterPhase) {
    const phaseModuleIds = modules.filter(m => m.phase_id === filterPhase).map(m => m.id);
    filteredResources = filteredResources.filter(r => phaseModuleIds.includes(r.module_id));
  }
  if (filterModule) {
    filteredResources = filteredResources.filter(r => r.module_id === filterModule);
  }

  const fileTypeColors: Record<string, string> = {
    PDF: 'from-red-500 to-red-600',
    Excel: 'from-green-500 to-green-600',
    Word: 'from-blue-500 to-blue-600',
    Other: 'from-gray-500 to-gray-600',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading resources...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
            <p className="text-gray-500">Manage downloadable documents and files</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addResource}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Resource
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

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filterPhase || ''}
          onChange={(e) => {
            setFilterPhase(e.target.value ? parseInt(e.target.value) : null);
            setFilterModule(null);
          }}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
        >
          <option value="">All Phases</option>
          {phases.sort((a, b) => a.phase_number - b.phase_number).map((phase) => (
            <option key={phase.id} value={phase.id}>
              Phase {phase.phase_number}: {phase.title}
            </option>
          ))}
        </select>
        <select
          value={filterModule || ''}
          onChange={(e) => setFilterModule(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
        >
          <option value="">All Modules</option>
          {modules
            .filter(m => !filterPhase || m.phase_id === filterPhase)
            .map((module) => (
              <option key={module.id} value={module.id}>
                {getModuleTitle(module.id)}
              </option>
            ))}
        </select>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Stats Bar */}
      <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
        <span>{filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}</span>
        <span>•</span>
        <span>{filteredResources.filter(r => r.file_type === 'PDF').length} PDFs</span>
        <span>•</span>
        <span>{filteredResources.filter(r => r.file_type === 'Word').length} Word docs</span>
        <span>•</span>
        <span>{filteredResources.filter(r => r.file_type === 'Excel').length} Excel files</span>
        {resources.some(r => r.isNew) && (
          <>
            <span>•</span>
            <span className="text-amber-600">{resources.filter(r => r.isNew).length} unsaved new</span>
          </>
        )}
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.sort((a, b) => a.module_id - b.module_id || a.order - b.order).map((resource) => (
          <div
            key={resource.id}
            className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${resource.isNew ? 'border-amber-400' : 'border-gray-200'}`}
          >
            {/* Resource Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setEditingId(editingId === resource.id ? null : resource.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${resource.isNew ? 'from-amber-500 to-amber-600' : fileTypeColors[resource.file_type]} flex items-center justify-center text-white font-bold text-xs`}>
                  {resource.file_type}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900 font-medium">{resource.title}</h3>
                    {resource.isNew && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{getModuleTitle(resource.module_id)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteResource(resource.id, resource.isNew || false); }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                  title="Delete resource"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${editingId === resource.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Edit Form */}
            {editingId === resource.id && (
              <div className="p-6 border-t border-gray-200 space-y-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={resource.title_ar}
                      onChange={(e) => updateResource(resource.id, 'title_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                    <textarea
                      value={resource.description}
                      onChange={(e) => updateResource(resource.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic)</label>
                    <textarea
                      dir="rtl"
                      value={resource.description_ar}
                      onChange={(e) => updateResource(resource.id, 'description_ar', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF] resize-none"
                    />
                  </div>
                </div>

                {/* File Settings */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="text-emerald-700 font-medium mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    File Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                      <input
                        type="url"
                        value={resource.file_url}
                        onChange={(e) => updateResource(resource.id, 'file_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                      <select
                        value={resource.file_type}
                        onChange={(e) => updateResource(resource.id, 'file_type', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                      >
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                        <option value="Word">Word</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
                      <input
                        type="text"
                        value={resource.file_size}
                        onChange={(e) => updateResource(resource.id, 'file_size', e.target.value)}
                        placeholder="e.g., 2.5 MB"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-emerald-600">
                    This document will appear in the Documents &amp; Resources section on the phase page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      value={resource.order}
                      onChange={(e) => updateResource(resource.id, 'order', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                    <select
                      value={resource.module_id}
                      onChange={(e) => updateResource(resource.id, 'module_id', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    >
                      {modules.map((module) => (
                        <option key={module.id} value={module.id}>
                          {getModuleTitle(module.id)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No resources found. Click &quot;Add Resource&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
