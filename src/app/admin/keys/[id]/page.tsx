'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import ComplianceBadge from '@/components/admin/ComplianceBadge';
import Modal from '@/components/admin/Modal';

interface KeyDetail {
  id: string;
  namespace_id: string;
  description: string | null;
  tags: string;
  status: string;
  created_at: string;
  translations: Translation[];
  overrides: Override[];
}

interface Translation {
  key_id: string;
  locale: string;
  value: string;
  status: string;
  approved_by: string | null;
  legal_approved_by: string | null;
  updated_at: string;
}

interface Override {
  id: number;
  key_id: string;
  locale: string;
  region: string;
  value: string;
  legal_approved_by: string | null;
  updated_at: string;
}

interface LocaleMeta {
  locale: string;
  display_name: string;
  english_name: string;
  direction: string;
}

// Status transition helpers
const FORWARD_TRANSITIONS: Record<string, { label: string; target: string }[]> = {
  draft: [{ label: 'Submit', target: 'review' }],
  review: [{ label: 'Approve', target: 'approved' }],
  approved: [{ label: 'Send Legal', target: 'legal_review' }],
  legal_review: [{ label: 'Approve', target: 'legal_approved' }],
};

const BACKWARD_TRANSITIONS: Record<string, { label: string; target: string }> = {
  review: { label: 'Reject', target: 'draft' },
  approved: { label: 'Reject', target: 'review' },
  legal_review: { label: 'Reject', target: 'approved' },
};

// Non-compliance keys: different transitions (no legal steps, approved can reopen)
const FORWARD_TRANSITIONS_SIMPLE: Record<string, { label: string; target: string }[]> = {
  draft: [{ label: 'Submit', target: 'review' }],
  review: [{ label: 'Approve', target: 'approved' }],
};

const BACKWARD_TRANSITIONS_SIMPLE: Record<string, { label: string; target: string }> = {
  review: { label: 'Reject', target: 'draft' },
  approved: { label: 'Reject', target: 'review' },
};

function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export default function KeyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const keyId = decodeURIComponent(params.id as string);

  const [key, setKey] = useState<KeyDetail | null>(null);
  const [locales, setLocales] = useState<LocaleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inline editor state
  const [editLocale, setEditLocale] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Metadata edit state
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaDesc, setMetaDesc] = useState('');
  const [metaStatus, setMetaStatus] = useState('');

  // Override form
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [ovLocale, setOvLocale] = useState('');
  const [ovRegion, setOvRegion] = useState('');
  const [ovValue, setOvValue] = useState('');
  const [editingOverrideId, setEditingOverrideId] = useState<number | null>(null);
  const [editOverrideValue, setEditOverrideValue] = useState('');

  // Save confirmation state (for non-draft translations)
  const [confirmSave, setConfirmSave] = useState<{ locale: string; currentStatus: string } | null>(null);

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/keys/${encodeURIComponent(keyId)}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) { setKey(data); setLoading(false); }
      })
      .catch(() => {
        if (!cancelled) { setError('Key not found'); setLoading(false); }
      });
    fetch('/api/locales')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setLocales(data);
      });
    return () => { cancelled = true; };
  }, [keyId, revision]);

  function refetch() { setRevision((r) => r + 1); }

  if (loading) return <div className="p-8 text-sm text-zinc-400">Loading...</div>;
  if (error || !key) return <div className="p-8 text-sm text-red-500">{error || 'Not found'}</div>;

  const tags = parseTags(key.tags);
  const isCompliance = tags.includes('compliance');

  // Pipeline steps depend on whether key is compliance-tagged
  const workflowSteps: string[] = isCompliance
    ? ['draft', 'review', 'approved', 'legal_review', 'legal_approved']
    : ['draft', 'review', 'approved'];

  // Build translation map: locale → translation
  const translationMap = new Map<string, Translation>();
  key.translations.forEach((t) => translationMap.set(t.locale, t));

  function requestSaveTranslation(locale: string) {
    const t = translationMap.get(locale);
    if (t && t.status !== 'draft') {
      setConfirmSave({ locale, currentStatus: t.status });
    } else {
      executeSaveTranslation(locale);
    }
  }

  async function executeSaveTranslation(locale: string) {
    setSaving(true);
    await fetch(`/api/keys/${encodeURIComponent(keyId)}/translations/${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: editValue }),
    });
    setSaving(false);
    setEditLocale(null);
    setConfirmSave(null);
    refetch();
  }

  async function handleStatusTransition(locale: string, target: string) {
    await fetch(`/api/keys/${encodeURIComponent(keyId)}/translations/${locale}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: target }),
    });
    refetch();
  }

  async function handleSaveMeta() {
    await fetch(`/api/keys/${encodeURIComponent(keyId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: metaDesc, status: metaStatus }),
    });
    setEditingMeta(false);
    refetch();
  }

  async function handleAddOverride(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/keys/${encodeURIComponent(keyId)}/overrides`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: ovLocale, region: ovRegion, value: ovValue }),
    });
    setShowOverrideForm(false);
    setOvLocale('');
    setOvRegion('');
    setOvValue('');
    refetch();
  }

  async function handleDeleteOverride(overrideId: number) {
    if (!confirm('Delete this override?')) return;
    await fetch(`/api/keys/${encodeURIComponent(keyId)}/overrides/${overrideId}`, {
      method: 'DELETE',
    });
    refetch();
  }

  async function handleApproveOverride(overrideId: number) {
    await fetch(`/api/keys/${encodeURIComponent(keyId)}/overrides/${overrideId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    refetch();
  }

  async function handleSaveOverrideEdit(overrideId: number) {
    if (!key) return;
    const ov = key.overrides.find((o) => o.id === overrideId);
    if (!ov) return;
    await fetch(`/api/keys/${encodeURIComponent(keyId)}/overrides`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: ov.locale, region: ov.region, value: editOverrideValue }),
    });
    setEditingOverrideId(null);
    refetch();
  }

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => router.push('/admin/keys')}
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 mb-6"
      >
        &larr; Back to Keys
      </button>

      {/* Section A: Key Metadata */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6">
        {!editingMeta ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-mono font-semibold text-zinc-900">{key.id}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {isCompliance && <ComplianceBadge expanded />}
                  <span className="text-sm text-zinc-500">Namespace: <span className="text-zinc-700">{key.namespace_id}</span></span>
                  <span className="text-sm text-zinc-500">Status:</span>
                  <StatusBadge status={key.status} />
                </div>
                {key.description && (
                  <p className="mt-3 text-sm text-zinc-500">{key.description}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingMeta(true);
                  setMetaDesc(key.description || '');
                  setMetaStatus(key.status);
                }}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Edit Metadata
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
              <input
                type="text"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
              <select
                value={metaStatus}
                onChange={(e) => setMetaStatus(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              >
                <option value="active">active</option>
                <option value="deprecated">deprecated</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveMeta} className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800">Save</button>
              <button onClick={() => setEditingMeta(false)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Section B: Translations */}
      <div className="rounded-xl border border-zinc-200 bg-white mb-6">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Translations</h2>
        </div>
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="w-[120px] text-start px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Locale</th>
              <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Value</th>
              <th className="w-[220px] text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Status</th>
              <th className="w-[220px] text-end px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locales.map((lm) => {
              const t = translationMap.get(lm.locale);
              const isEditing = editLocale === lm.locale;

              // Compute transitions once — used in both row and expansion panel
              const fwdMap = isCompliance ? FORWARD_TRANSITIONS : FORWARD_TRANSITIONS_SIMPLE;
              const bwdMap = isCompliance ? BACKWARD_TRANSITIONS : BACKWARD_TRANSITIONS_SIMPLE;
              const validForward = t ? (fwdMap[t.status] || []) : [];
              const backward = t ? bwdMap[t.status] : undefined;

              return (
                <React.Fragment key={lm.locale}>
                <tr
                  className="border-b border-zinc-50 cursor-pointer hover:bg-zinc-50/60 transition-colors"
                  onClick={() => {
                    if (isEditing) {
                      setEditLocale(null);
                    } else {
                      setEditLocale(lm.locale);
                      setEditValue(t?.value ?? '');
                    }
                  }}
                >
                  <td className="px-6 py-3">
                    <div className="font-mono text-zinc-900 text-xs">{lm.locale}</div>
                    <div className="text-[11px] text-zinc-400">{lm.english_name}</div>
                  </td>
                  <td className="px-4 py-3 overflow-hidden">
                    {t ? (
                      <span className="text-zinc-600 truncate block font-mono text-xs">{t.value}</span>
                    ) : (
                      <span className="text-zinc-300 italic">— missing —</span>
                    )}
                  </td>
                  {/* Status column with workflow progress */}
                  <td className="px-4 py-3">
                    {t ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5" title={t.status.replace(/_/g, ' ')}>
                          {workflowSteps.map((step, i) => {
                            const currentIdx = workflowSteps.indexOf(t.status as typeof workflowSteps[number]);
                            const isComplete = i < currentIdx;
                            const isCurrent = i === currentIdx;
                            return (
                              <div
                                key={step}
                                className={`h-1.5 rounded-full ${
                                  isCurrent
                                    ? 'w-4 bg-zinc-900'
                                    : isComplete
                                    ? 'w-1.5 bg-zinc-400'
                                    : 'w-1.5 bg-zinc-200'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <StatusBadge status={t.status} />
                      </div>
                    ) : null}
                  </td>
                  {/* Actions: inline status transitions */}
                  <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {t ? (
                        <>
                          {backward && (
                            <button
                              onClick={() => handleStatusTransition(lm.locale, backward.target)}
                              className="w-24 rounded-md border border-zinc-200 px-3 py-1.5 text-[11px] font-mono text-zinc-500 hover:bg-zinc-100 whitespace-nowrap"
                            >
                              {backward.label}
                            </button>
                          )}
                          {validForward.map((f) => (
                            <button
                              key={f.target}
                              onClick={() => handleStatusTransition(lm.locale, f.target)}
                              className="w-24 rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-mono text-white hover:bg-zinc-800 whitespace-nowrap"
                            >
                              {f.label}
                            </button>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>

                {/* Expanded inline editor — text only, no status buttons */}
                {isEditing && (
                  <tr className="border-b border-zinc-100">
                    <td colSpan={4} className="px-6 py-4 bg-zinc-50/50">
                      <div className="space-y-3">
                        <div className="text-xs text-zinc-400">
                          {lm.english_name} ({lm.locale}) &middot; Direction: {(lm.direction || 'ltr').toUpperCase()}
                        </div>
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={3}
                          dir={(lm.direction || 'ltr') === 'rtl' ? 'rtl' : 'ltr'}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm font-mono resize-y"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => requestSaveTranslation(lm.locale)}
                            disabled={saving}
                            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditLocale(null)}
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
                          >
                            Cancel
                          </button>
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
      </div>

      {/* Section C: Region Overrides */}
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Region Overrides</h2>
          <button
            onClick={() => setShowOverrideForm(!showOverrideForm)}
            className="text-xs text-zinc-900 font-medium hover:text-zinc-700"
          >
            + Add Override
          </button>
        </div>

        {/* Add override form */}
        {showOverrideForm && (
          <form onSubmit={handleAddOverride} className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1 uppercase tracking-wider">Locale</label>
                <select
                  required
                  value={ovLocale}
                  onChange={(e) => setOvLocale(e.target.value)}
                  className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm"
                >
                  <option value="">Select...</option>
                  {locales.map((l) => (
                    <option key={l.locale} value={l.locale}>{l.locale}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1 uppercase tracking-wider">Region</label>
                <select
                  required
                  value={ovRegion}
                  onChange={(e) => setOvRegion(e.target.value)}
                  className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                  <option value="MENA">MENA</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-medium text-zinc-400 mb-1 uppercase tracking-wider">Value</label>
                <input
                  type="text"
                  required
                  value={ovValue}
                  onChange={(e) => setOvValue(e.target.value)}
                  className="w-full rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm font-mono"
                />
              </div>
              <button type="submit" className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800">
                Add
              </button>
              <button type="button" onClick={() => setShowOverrideForm(false)} className="text-xs text-zinc-400 hover:text-zinc-600">
                Cancel
              </button>
            </div>
          </form>
        )}

        {key.overrides.length === 0 && !showOverrideForm ? (
          <div className="px-6 py-6 text-sm text-zinc-400 text-center">No region overrides</div>
        ) : (
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="w-[100px] text-start px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Locale</th>
                <th className="w-[80px] text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Region</th>
                <th className="text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Value</th>
                <th className="w-[140px] text-start px-4 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Legal</th>
                <th className="w-[180px] text-end px-6 py-2.5 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {key.overrides.map((ov) => {
                const isOvEditing = editingOverrideId === ov.id;
                const isApproved = !!ov.legal_approved_by;
                return (
                  <React.Fragment key={ov.id}>
                  <tr
                    className="border-b border-zinc-50 cursor-pointer hover:bg-zinc-50/60 transition-colors"
                    onClick={() => {
                      if (isOvEditing) {
                        setEditingOverrideId(null);
                      } else {
                        setEditingOverrideId(ov.id);
                        setEditOverrideValue(ov.value);
                      }
                    }}
                  >
                    <td className="px-6 py-3 font-mono text-xs">{ov.locale}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono">{ov.region}</span>
                    </td>
                    <td className="px-4 py-3 overflow-hidden">
                      <span className="text-zinc-600 truncate block font-mono text-xs">{ov.value}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5" title={isApproved ? 'approved' : 'pending'}>
                          <div className={`h-1.5 rounded-full ${isApproved ? 'w-1.5 bg-zinc-400' : 'w-4 bg-zinc-900'}`} />
                          <div className={`h-1.5 rounded-full ${isApproved ? 'w-4 bg-zinc-900' : 'w-1.5 bg-zinc-200'}`} />
                        </div>
                        <span className={`text-xs font-medium ${isApproved ? 'text-zinc-500' : 'text-amber-600'}`}>
                          {isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteOverride(ov.id)}
                          className="rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-mono text-zinc-500 hover:bg-zinc-100"
                        >
                          Delete
                        </button>
                        {!isApproved && (
                          <button
                            onClick={() => handleApproveOverride(ov.id)}
                            className="rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-white hover:bg-zinc-800"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isOvEditing && (
                    <tr className="border-b border-zinc-100">
                      <td colSpan={5} className="px-6 py-4 bg-zinc-50/50">
                        <div className="space-y-3">
                          <div className="text-xs text-zinc-400">
                            {ov.locale} &middot; {ov.region}
                          </div>
                          <textarea
                            value={editOverrideValue}
                            onChange={(e) => setEditOverrideValue(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm font-mono resize-y"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveOverrideEdit(ov.id)}
                              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingOverrideId(null)}
                              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
                            >
                              Cancel
                            </button>
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
        )}
      </div>

      {/* Save confirmation modal — warns that saving resets status to draft */}
      <Modal
        open={confirmSave !== null}
        onClose={() => setConfirmSave(null)}
        title="Save will reset status"
      >
        {confirmSave && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600">
              This translation is currently{' '}
              <StatusBadge status={confirmSave.currentStatus} />.
              Saving new text will reset its status to{' '}
              <StatusBadge status="draft" /> and clear all approvals.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmSave(null)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => executeSaveTranslation(confirmSave.locale)}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800"
              >
                Save &amp; Reset
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
