'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Testimonial {
  id: number;
  name: string;
  name_ar: string;
  quote: string;
  quote_ar: string;
  role: string;
  role_ar: string;
  photo_url: string;
  order: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.replace('/admin');
          return;
        }

        const res = await fetch('/api/admin/content?type=testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'testimonials', data: { testimonials } }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Testimonials saved successfully!' });
        setEditingId(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save testimonials' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonial = (id: number, field: keyof Testimonial, value: string | number) => {
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const addTestimonial = () => {
    const newId = Math.max(...testimonials.map(t => t.id), 0) + 1;
    setTestimonials([
      ...testimonials,
      {
        id: newId,
        name: 'New Testimonial',
        name_ar: 'شهادة جديدة',
        quote: '',
        quote_ar: '',
        role: '',
        role_ar: '',
        photo_url: '',
        order: testimonials.length + 1,
      },
    ]);
    setEditingId(newId);
  };

  const deleteTestimonial = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading testimonials...</div>
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
            <h1 className="text-2xl font-bold text-white">Testimonials</h1>
            <p className="text-slate-400">Edit participant testimonials and quotes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addTestimonial}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors"
          >
            + Add Testimonial
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

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.sort((a, b) => a.order - b.order).map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Testimonial Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setEditingId(editingId === testimonial.id ? null : testimonial.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{testimonial.name}</h3>
                  <p className="text-slate-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTestimonial(testimonial.id); }}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${editingId === testimonial.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Edit Form */}
            {editingId === testimonial.id && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name (English)</label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={testimonial.name_ar}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Role/Title (English)</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Role/Title (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={testimonial.role_ar}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quote (English)</label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quote (Arabic)</label>
                    <textarea
                      dir="rtl"
                      value={testimonial.quote_ar}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote_ar', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Photo URL (optional)</label>
                    <input
                      type="url"
                      value={testimonial.photo_url}
                      onChange={(e) => updateTestimonial(testimonial.id, 'photo_url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                    <input
                      type="number"
                      value={testimonial.order}
                      onChange={(e) => updateTestimonial(testimonial.id, 'order', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No testimonials found. Click &quot;Add Testimonial&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}

