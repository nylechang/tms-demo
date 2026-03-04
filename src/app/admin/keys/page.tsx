'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import ComplianceBadge from '@/components/admin/ComplianceBadge';
import Modal from '@/components/admin/Modal';

interface TranslationKey {
  id: string;
  namespace_id: string;
  description: string | null;
  tags: string;
  status: string;
  created_at: string;
  namespace_description: string;
}

function hasComplianceTag(tags: string): boolean {
  try {
    const arr = JSON.parse(tags);
    return Array.isArray(arr) && arr.includes('compliance');
  } catch {
    return false;
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function FunnelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 2h12l-4.5 5.5V12l-3-1.5V7.5L1 2Z" />
    </svg>
  );
}

export default function KeysDashboard() {
  const router = useRouter();
  const [keys, setKeys] = useState<TranslationKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [revision, setRevision] = useState(0);

  // Filters
  const [nsFilter, setNsFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (nsFilter) params.set('namespace', nsFilter);
    if (tagFilter) params.set('tag', tagFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);

    fetch(`/api/keys?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setKeys(data);
        setNamespaces((prev) =>
          prev.length === 0
            ? [...new Set(data.map((k: TranslationKey) => k.namespace_id))]
            : prev
        );
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [nsFilter, tagFilter, statusFilter, search, revision]);

  // Add key form state
  const [newKeyId, setNewKeyId] = useState('');
  const [newKeyNs, setNewKeyNs] = useState('');
  const [newKeyDesc, setNewKeyDesc] = useState('');
  const [newKeyCompliance, setNewKeyCompliance] = useState(false);
  const [addError, setAddError] = useState('');

  async function handleAddKey(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    const fullId = newKeyNs ? `${newKeyNs}:${newKeyId}` : newKeyId;
    const tags = newKeyCompliance ? ['compliance'] : [];

    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fullId, namespace_id: newKeyNs, description: newKeyDesc || null, tags }),
    });

    if (!res.ok) {
      const err = await res.json();
      setAddError(err.error || 'Failed to create key');
      return;
    }

    setShowAddModal(false);
    setNewKeyId('');
    setNewKeyNs('');
    setNewKeyDesc('');
    setNewKeyCompliance(false);
    setRevision((r) => r + 1);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-zinc-900">All Keys</h1>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-mono text-zinc-500">
            {keys.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            <FunnelIcon />
            Filter
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            + Add Key
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search keys..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <select value={nsFilter} onChange={(e) => setNsFilter(e.target.value)} className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700">
            <option value="">All Namespaces</option>
            {namespaces.map((ns) => <option key={ns} value={ns}>{ns}</option>)}
          </select>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700">
            <option value="">All Tags</option>
            <option value="compliance">compliance</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700">
            <option value="">All Statuses</option>
            <option value="active">active</option>
            <option value="deprecated">deprecated</option>
          </select>
          <button onClick={() => { setNsFilter(''); setTagFilter(''); setStatusFilter(''); setSearch(''); }} className="text-xs text-zinc-400 hover:text-zinc-600 ms-auto">
            Clear filters
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-400">Loading...</div>
        ) : keys.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400">No keys found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-start px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Namespace</th>
                <th className="text-start px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Key</th>
                <th className="text-start px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Description</th>
                <th className="text-start px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Status</th>
                <th className="text-end px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Created On</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => {
                const isCompliance = hasComplianceTag(key.tags);
                const shortKey = key.id.includes(':') ? key.id.split(':').slice(1).join(':') : key.id;
                return (
                  <tr key={key.id} onClick={() => router.push(`/admin/keys/${encodeURIComponent(key.id)}`)} className="border-b border-zinc-50 hover:bg-zinc-50/50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{key.namespace_id}</td>
                    <td className="px-4 py-3">
                      <div><span className="font-mono font-semibold text-zinc-900">{shortKey}</span></div>
                      {isCompliance && <div className="mt-1"><ComplianceBadge /></div>}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 max-w-[300px] truncate">{key.description || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={key.status} /></td>
                    <td className="px-4 py-3 text-end text-zinc-400 text-xs whitespace-nowrap">{key.created_at ? formatDate(key.created_at) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Key Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Key">
        <form onSubmit={handleAddKey}>
          {addError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{addError}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Namespace</label>
              <select required value={newKeyNs} onChange={(e) => setNewKeyNs(e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm">
                <option value="">Select namespace...</option>
                {namespaces.map((ns) => <option key={ns} value={ns}>{ns}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Key ID</label>
              <div className="flex items-center gap-0">
                {newKeyNs && (
                  <span className="rounded-s-lg border border-e-0 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-400">{newKeyNs}:</span>
                )}
                <input type="text" required placeholder="e.g. nav.home" value={newKeyId} onChange={(e) => setNewKeyId(e.target.value)} className={`flex-1 border border-zinc-200 px-3 py-2 text-sm font-mono ${newKeyNs ? 'rounded-e-lg' : 'rounded-lg'}`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
              <input type="text" placeholder="Optional description" value={newKeyDesc} onChange={(e) => setNewKeyDesc(e.target.value)} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" checked={newKeyCompliance} onChange={(e) => setNewKeyCompliance(e.target.checked)} className="rounded border-zinc-300" />
              Compliance key (requires legal approval)
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50">Cancel</button>
            <button type="submit" className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-zinc-800">Create Key</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
