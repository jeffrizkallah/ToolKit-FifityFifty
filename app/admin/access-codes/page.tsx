'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AccessCode {
  id: number;
  code: string;
  description: string | null;
  max_uses: number | null;
  usage_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

interface Registration {
  id: number;
  code_id: number;
  full_name: string;
  age: number;
  contact_number: string;
  email_address: string;
  governorate: string;
  electoral_district: string;
  current_address: string;
  created_at: string;
}

interface CodeStatistics {
  totalRegistrations: number;
  governorateBreakdown: Record<string, number>;
  districtBreakdown: Record<string, number>;
  averageAge: number;
}

export default function AccessCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<AccessCode | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [statistics, setStatistics] = useState<CodeStatistics | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const router = useRouter();

  // Create form state
  const [newCodeDescription, setNewCodeDescription] = useState('');
  const [newCodeMaxUses, setNewCodeMaxUses] = useState('');
  const [newCodeExpires, setNewCodeExpires] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch('/api/admin/auth');
      if (!authRes.ok) {
        router.replace('/admin');
        return;
      }
      await loadCodes();
    } catch (error) {
      console.error('Auth error:', error);
      router.replace('/admin');
    }
  };

  const loadCodes = async () => {
    try {
      const res = await fetch('/api/admin/access-codes');
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
      }
    } catch (error) {
      console.error('Error loading codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/access-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newCodeDescription || undefined,
          maxUses: newCodeMaxUses || undefined,
          expiresAt: newCodeExpires || undefined,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewCodeDescription('');
        setNewCodeMaxUses('');
        setNewCodeExpires('');
        await loadCodes();
      }
    } catch (error) {
      console.error('Error creating code:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (code: AccessCode) => {
    try {
      const res = await fetch(`/api/admin/access-codes/${code.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !code.is_active }),
      });

      if (res.ok) {
        await loadCodes();
      }
    } catch (error) {
      console.error('Error updating code:', error);
    }
  };

  const handleDeleteCode = async (code: AccessCode) => {
    if (!confirm(`Are you sure you want to delete code ${code.code}? This will also delete all registrations.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/access-codes/${code.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadCodes();
        if (selectedCode?.id === code.id) {
          setSelectedCode(null);
          setRegistrations([]);
          setStatistics(null);
        }
      }
    } catch (error) {
      console.error('Error deleting code:', error);
    }
  };

  const handleViewDetails = async (code: AccessCode) => {
    setSelectedCode(code);
    setLoadingDetails(true);

    try {
      const res = await fetch(`/api/admin/access-codes/${code.id}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setStatistics(data.statistics || null);
      }
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExportCSV = (code: AccessCode) => {
    window.open(`/api/admin/access-codes/${code.id}/export`, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading access codes...</div>
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
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Access Codes</h1>
            <p className="text-gray-500">Manage access codes and view registrations</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg"
        >
          + Create New Code
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Codes List */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">All Access Codes ({codes.length})</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {codes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No access codes created yet.</p>
                <p className="text-sm mt-2">Click &quot;Create New Code&quot; to get started.</p>
              </div>
            ) : (
              codes.map((code) => (
                <div
                  key={code.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedCode?.id === code.id ? 'bg-cyan-50 border-l-4 border-cyan-500' : ''
                  }`}
                  onClick={() => handleViewDetails(code)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {code.code}
                        </code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(code.code);
                          }}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                          title="Copy code"
                        >
                          📋
                        </button>
                      </div>
                      {code.description && (
                        <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Uses: {code.usage_count}
                          {code.max_uses ? `/${code.max_uses}` : '/∞'}
                        </span>
                        <span>
                          Created: {new Date(code.created_at).toLocaleDateString()}
                        </span>
                        {code.expires_at && (
                          <span className={new Date(code.expires_at) < new Date() ? 'text-red-500' : ''}>
                            Expires: {new Date(code.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          code.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {code.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(code);
                      }}
                      className={`text-xs px-3 py-1 rounded ${
                        code.is_active
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {code.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportCSV(code);
                      }}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCode(code);
                      }}
                      className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {selectedCode ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900">
                  Registrations for {selectedCode.code}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedCode.description || 'No description'}
                </p>
              </div>

              {loadingDetails ? (
                <div className="p-8 text-center text-gray-500 animate-pulse">
                  Loading details...
                </div>
              ) : (
                <>
                  {/* Statistics */}
                  {statistics && statistics.totalRegistrations > 0 && (
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-cyan-600">
                            {statistics.totalRegistrations}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {statistics.averageAge}
                          </div>
                          <div className="text-xs text-gray-500">Avg Age</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-indigo-600">
                            {Object.keys(statistics.governorateBreakdown).length}
                          </div>
                          <div className="text-xs text-gray-500">Governorates</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Object.keys(statistics.districtBreakdown).length}
                          </div>
                          <div className="text-xs text-gray-500">Districts</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registrations List */}
                  <div className="divide-y divide-gray-100 max-h-[450px] overflow-y-auto">
                    {registrations.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No registrations yet.</p>
                      </div>
                    ) : (
                      registrations.map((reg) => (
                        <div key={reg.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{reg.full_name}</p>
                              <p className="text-sm text-gray-500">{reg.email_address}</p>
                              <p className="text-xs text-gray-400">{reg.contact_number}</p>
                            </div>
                            <div className="text-right text-sm">
                              <p className="text-gray-600">Age: {reg.age}</p>
                              <p className="text-gray-500">{reg.governorate}</p>
                              <p className="text-gray-400">{reg.electoral_district}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-1" title={reg.current_address}>
                            📍 {reg.current_address}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Registered: {new Date(reg.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">👈</div>
              <p>Select an access code to view registrations</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Access Code</h3>
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newCodeDescription}
                  onChange={(e) => setNewCodeDescription(e.target.value)}
                  placeholder="e.g., December Training Workshop"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  value={newCodeMaxUses}
                  onChange={(e) => setNewCodeMaxUses(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={newCodeExpires}
                  onChange={(e) => setNewCodeExpires(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

