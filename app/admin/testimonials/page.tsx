'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
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

  const handleFileUpload = async (id: number, file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF.' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size exceeds 5MB limit.' });
      return;
    }

    setUploadingId(id);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'testimonials');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateTestimonial(id, 'photo_url', data.url);
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while uploading' });
    } finally {
      setUploadingId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    setDragOverId(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(id, files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading testimonials...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-500">Edit participant testimonials and quotes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addTestimonial}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 transition-colors"
          >
            + Add Testimonial
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

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.sort((a, b) => a.order - b.order).map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Testimonial Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setEditingId(editingId === testimonial.id ? null : testimonial.id)}
            >
              <div className="flex items-center gap-4">
                {testimonial.photo_url ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={testimonial.photo_url}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-gray-900 font-medium">{testimonial.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTestimonial(testimonial.id); }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${editingId === testimonial.id ? 'rotate-180' : ''}`}
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
              <div className="p-6 border-t border-gray-200 space-y-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={testimonial.name_ar}
                      onChange={(e) => updateTestimonial(testimonial.id, 'name_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title (English)</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title (Arabic)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={testimonial.role_ar}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role_ar', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote (English)</label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote (Arabic)</label>
                    <textarea
                      dir="rtl"
                      value={testimonial.quote_ar}
                      onChange={(e) => updateTestimonial(testimonial.id, 'quote_ar', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF] resize-none"
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                    
                    {/* Upload Area */}
                    <div
                      onDrop={(e) => handleDrop(e, testimonial.id)}
                      onDragOver={(e) => handleDragOver(e, testimonial.id)}
                      onDragLeave={handleDragLeave}
                      className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
                        dragOverId === testimonial.id
                          ? 'border-[#0063AF] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {uploadingId === testimonial.id ? (
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="w-8 h-8 border-2 border-[#0063AF] border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : testimonial.photo_url ? (
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={testimonial.photo_url}
                              alt="Preview"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 truncate mb-2">
                              {testimonial.photo_url.split('/').pop()}
                            </p>
                            <div className="flex gap-2">
                              <label className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors">
                                Replace
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/gif"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(testimonial.id, file);
                                  }}
                                  className="hidden"
                                />
                              </label>
                              <button
                                onClick={() => updateTestimonial(testimonial.id, 'photo_url', '')}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-sm text-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            JPEG, PNG, WebP or GIF (max 5MB)
                          </p>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(testimonial.id, file);
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* URL Input (Alternative) */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-400 uppercase">or enter URL</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                      <input
                        type="url"
                        value={testimonial.photo_url}
                        onChange={(e) => updateTestimonial(testimonial.id, 'photo_url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0063AF] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      value={testimonial.order}
                      onChange={(e) => updateTestimonial(testimonial.id, 'order', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0063AF]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No testimonials found. Click &quot;Add Testimonial&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
