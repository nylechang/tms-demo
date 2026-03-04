'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuditEntry {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: string | null;
  new_value: string | null;
  performed_by: string;
  timestamp: string;
}

function formatJson(val: string | null): string {
  if (!val) return '—';
  try {
    return JSON.stringify(JSON.parse(val), null, 2);
  } catch {
    return val;
  }
}

export default function AuditLogPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filters
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [user, setUser] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const PAGE_SIZE = 50;

  function buildParams(currentOffset: number) {
    const params = new URLSearchParams();
    if (action) params.set('action', action);
    if (entityType) params.set('entity_type', entityType);
    if (entityId) params.set('entity_id', entityId);
    if (user) params.set('performed_by', user);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(currentOffset));
    return params;
  }

  // Reset and fetch first page when filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setOffset(0);

    fetch(`/api/audit-log?${buildParams(0)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setEntries(data.entries ?? []);
          setHasMore(data.hasMore ?? false);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, entityType, entityId, user, from, to]);

  function loadMore() {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    fetch(`/api/audit-log?${buildParams(nextOffset)}`)
      .then((r) => r.json())
      .then((data) => {
        setEntries((prev) => [...prev, ...(data.entries ?? [])]);
        setHasMore(data.hasMore ?? false);
        setOffset(nextOffset);
        setLoadingMore(false);
      });
  }

  function clearFilters() {
    setAction('');
    setEntityType('');
    setEntityId('');
    setUser('');
    setFrom('');
    setTo('');
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isClickableEntity(type: string): boolean {
    return ['translation_key', 'translation', 'region_override'].includes(type);
  }

  function getEntityLink(type: string, id: string): string | null {
    if (type === 'translation_key') return `/admin/keys/${encodeURIComponent(id)}`;
    if (type === 'translation') {
      // ID format: keyId:locale — extract keyId
      const keyId = id.split(':').slice(0, -1).join(':');
      return keyId ? `/admin/keys/${encodeURIComponent(keyId)}` : null;
    }
    if (type === 'region_override') {
      // entity_id might be the key_id
      return `/admin/keys/${encodeURIComponent(id)}`;
    }
    return null;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Audit Log</h1>

      {/* Filters */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700"
          >
            <option value="">All Actions</option>
            <option value="create">create</option>
            <option value="update">update</option>
            <option value="delete">delete</option>
            <option value="status_change">status_change</option>
            <option value="legal_approve">legal_approve</option>
            <option value="publish">publish</option>
            <option value="rollback">rollback</option>
          </select>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700"
          >
            <option value="">All Entities</option>
            <option value="translation_key">translation_key</option>
            <option value="translation">translation</option>
            <option value="region_override">region_override</option>
            <option value="version">version</option>
            <option value="fallback_config">fallback_config</option>
          </select>
          <input
            type="text"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="Entity ID..."
            className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm w-40"
          />
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User..."
            className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm w-28"
          />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm"
          />
          <button
            onClick={clearFilters}
            className="text-xs text-zinc-400 hover:text-zinc-600 ms-auto"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400">No audit entries found</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-start px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Timestamp</th>
                  <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Action</th>
                  <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Entity</th>
                  <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">By</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isExpanded = expandedId === entry.id;
                  const link = getEntityLink(entry.entity_type, entry.entity_id);

                  return (
                    <React.Fragment key={entry.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        className="border-b border-zinc-50 hover:bg-zinc-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-3 text-xs text-zinc-400 font-mono whitespace-nowrap">
                          {formatDate(entry.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono text-zinc-600">
                            {entry.action}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[11px] text-zinc-400">{entry.entity_type}</div>
                          {link && isClickableEntity(entry.entity_type) ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(link);
                              }}
                              className="font-mono text-xs text-zinc-900 hover:underline"
                            >
                              {entry.entity_id}
                            </button>
                          ) : (
                            <span className="font-mono text-xs text-zinc-600">{entry.entity_id}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{entry.performed_by}</td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${entry.id}-detail`} className="border-b border-zinc-100">
                          <td colSpan={4} className="px-6 py-4 bg-zinc-50/50">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1">Old Value</div>
                                <pre className="text-xs font-mono text-zinc-600 whitespace-pre-wrap bg-white rounded-lg border border-zinc-200 p-3 max-h-40 overflow-auto">
                                  {formatJson(entry.old_value)}
                                </pre>
                              </div>
                              <div>
                                <div className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1">New Value</div>
                                <pre className="text-xs font-mono text-zinc-600 whitespace-pre-wrap bg-white rounded-lg border border-zinc-200 p-3 max-h-40 overflow-auto">
                                  {formatJson(entry.new_value)}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* Load More */}
            {hasMore && (
              <div className="px-6 py-3 border-t border-zinc-100 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-xs text-zinc-400 hover:text-zinc-600 disabled:opacity-40"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
