'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  site_title: string;
  site_title_ar: string;
  hero_headline: string;
  hero_headline_ar: string;
  hero_description: string;
  hero_description_ar: string;
  hero_video_url: string;
  footer_text: string;
  footer_text_ar: string;
  social_links: Array<{ platform: string; url: string }>;
}

const defaultSettings: Settings = {
  site_title: '',
  site_title_ar: '',
  hero_headline: '',
  hero_headline_ar: '',
  hero_description: '',
  hero_description_ar: '',
  hero_video_url: '',
  footer_text: '',
  footer_text_ar: '',
  social_links: [],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.replace('/admin');
          return;
        }

        const res = await fetch('/api/admin/content?type=settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: settings }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...settings.social_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings({ ...settings, social_links: newLinks });
  };

  const addSocialLink = () => {
    setSettings({
      ...settings,
      social_links: [...settings.social_links, { platform: '', url: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    setSettings({
      ...settings,
      social_links: settings.social_links.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading settings...</div>
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
            <h1 className="text-2xl font-bold text-white">Site Settings</h1>
            <p className="text-slate-400">Edit global site configuration</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Site Title */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Site Title</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">English</label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Arabic</label>
              <input
                type="text"
                dir="rtl"
                value={settings.site_title_ar}
                onChange={(e) => setSettings({ ...settings, site_title_ar: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hero Section</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Headline (English)</label>
                <input
                  type="text"
                  value={settings.hero_headline}
                  onChange={(e) => setSettings({ ...settings, hero_headline: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Headline (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settings.hero_headline_ar}
                  onChange={(e) => setSettings({ ...settings, hero_headline_ar: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description (English)</label>
                <textarea
                  value={settings.hero_description}
                  onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description (Arabic)</label>
                <textarea
                  dir="rtl"
                  value={settings.hero_description_ar}
                  onChange={(e) => setSettings({ ...settings, hero_description_ar: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hero Video URL</label>
              <input
                type="url"
                value={settings.hero_video_url}
                onChange={(e) => setSettings({ ...settings, hero_video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Footer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Footer Text (English)</label>
              <input
                type="text"
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Footer Text (Arabic)</label>
              <input
                type="text"
                dir="rtl"
                value={settings.footer_text_ar}
                onChange={(e) => setSettings({ ...settings, footer_text_ar: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Social Links</h2>
            <button
              onClick={addSocialLink}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm text-white transition-colors"
            >
              + Add Link
            </button>
          </div>
          
          <div className="space-y-3">
            {settings.social_links.map((link, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  placeholder="Platform (e.g., facebook)"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-[2] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                />
                <button
                  onClick={() => removeSocialLink(index)}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {settings.social_links.length === 0 && (
              <p className="text-slate-500 text-sm">No social links added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

