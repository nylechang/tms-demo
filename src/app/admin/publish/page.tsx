'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';

interface PublishReport {
  version: number;
  includedKeys: number;
  excludedKeys: number;
  warnings: { type: string; key: string; locale: string; detail: string }[];
  overrideBundles: number;
}

interface Version {
  version: number;
  published_at: string;
  published_by: string;
  notes: string | null;
  status: string;
}

export default function PublishPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');

  // Publish flow state
  const [dryRunReport, setDryRunReport] = useState<PublishReport | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/versions')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setVersions(data);
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [revision]);

  async function handleDryRun() {
    setPublishing(true);
    setPublishResult(null);
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dry_run: true, notes, published_by: 'admin' }),
    });
    const data = await res.json();
    setDryRunReport(data);
    setPublishing(false);
  }

  async function handleConfirmPublish() {
    setPublishing(true);
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dry_run: false, notes, published_by: 'admin' }),
    });
    if (res.ok) {
      const data = await res.json();
      setPublishResult(`Published v${data.version} successfully`);
      setDryRunReport(null);
      setNotes('');
      setRevision((r) => r + 1);
    } else {
      const err = await res.json();
      setPublishResult(`Error: ${err.error || 'Publish failed'}`);
    }
    setPublishing(false);
  }

  async function handleRollback(version: number) {
    if (!confirm(`Rollback to v${version}? This creates a new version from that snapshot.`)) return;
    const res = await fetch(`/api/versions/${version}/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ performed_by: 'admin' }),
    });
    if (res.ok) {
      setRevision((r) => r + 1);
    }
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

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Publish</h1>

      {/* Publish Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-4">Publish New Version</h2>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5">
            Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional release notes..."
            className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDryRun}
            disabled={publishing}
            className="rounded-lg border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
          >
            Dry Run
          </button>
        </div>

        {/* Success/error message */}
        {publishResult && (
          <div
            className={`mt-4 rounded-lg px-3 py-2 text-sm ${
              publishResult.startsWith('Error')
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            {publishResult}
          </div>
        )}

        {/* Dry run report */}
        {dryRunReport && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-medium text-zinc-900 mb-3">
              Dry Run Report — v{dryRunReport.version} (preview)
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-600 mb-3">
              <span>Included: <span className="font-mono font-medium">{dryRunReport.includedKeys}</span></span>
              <span>Excluded: <span className="font-mono font-medium">{dryRunReport.excludedKeys}</span></span>
              <span>Override bundles: <span className="font-mono font-medium">{dryRunReport.overrideBundles}</span></span>
            </div>

            {dryRunReport.warnings.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-2">
                  Warnings ({dryRunReport.warnings.length})
                </div>
                <div className="space-y-1.5">
                  {dryRunReport.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-amber-500 mt-0.5">!</span>
                      <span className="font-mono text-zinc-600">
                        {w.key} / {w.locale}
                      </span>
                      <span className="text-zinc-400">— {w.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDryRunReport(null)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={publishing}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                Confirm Publish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Version History */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Version History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-400">Loading...</div>
        ) : versions.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400">No versions published yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-start px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Version</th>
                <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Published</th>
                <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">By</th>
                <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Notes</th>
                <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Status</th>
                <th className="text-end px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.version} className="border-b border-zinc-50">
                  <td className="px-6 py-3 font-mono font-semibold text-zinc-900">v{v.version}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{formatDate(v.published_at)}</td>
                  <td className="px-4 py-3 text-zinc-500">{v.published_by}</td>
                  <td className="px-4 py-3 text-zinc-500 max-w-[200px] truncate">{v.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-6 py-3 text-end">
                    {v.status === 'active' && v.version !== versions[0].version && (
                      <button
                        onClick={() => handleRollback(v.version)}
                        className="text-xs text-zinc-400 hover:text-zinc-600"
                      >
                        Rollback
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
