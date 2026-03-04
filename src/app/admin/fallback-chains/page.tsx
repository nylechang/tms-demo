'use client';

import { useEffect, useState } from 'react';

interface FallbackChain {
  locale: string;
  fallback_chain: string[];
  display_name: string;
  english_name: string;
}

export default function FallbackChainsPage() {
  const [chains, setChains] = useState<FallbackChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLocale, setEditLocale] = useState<string | null>(null);
  const [editChain, setEditChain] = useState('');
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/fallback-chains')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setChains(data);
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [revision]);

  async function handleSave(locale: string) {
    setSaving(true);
    const chain = editChain
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await fetch(`/api/fallback-chains/${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fallback_chain: chain }),
    });
    setSaving(false);
    setEditLocale(null);
    setRevision((r) => r + 1);
  }

  // Build resolution preview for selected locale
  function getResolutionChain(locale: string): string[] {
    const entry = chains.find((c) => c.locale === locale);
    if (!entry) return [locale];
    return [locale, ...entry.fallback_chain];
  }

  if (loading) return <div className="p-8 text-sm text-zinc-400">Loading...</div>;

  const preview = selectedLocale ? getResolutionChain(selectedLocale) : null;

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Fallback Chains</h1>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-start px-6 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Locale</th>
              <th className="text-start px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Display Name</th>
              <th className="text-start px-4 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Chain</th>
              <th className="text-end px-6 py-3 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chains.map((c) => {
              const isEditing = editLocale === c.locale;
              const isBase = c.fallback_chain.length === 0;

              return (
                <tr
                  key={c.locale}
                  className={`border-b border-zinc-50 cursor-pointer transition-colors ${
                    selectedLocale === c.locale ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'
                  }`}
                  onClick={() => setSelectedLocale(c.locale)}
                >
                  <td className="px-6 py-3">
                    <span className="font-mono font-semibold text-zinc-900 text-xs">{c.locale}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    <span>{c.display_name}</span>
                    <span className="text-zinc-300 ms-1.5 text-xs">({c.english_name})</span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editChain}
                          onChange={(e) => setEditChain(e.target.value)}
                          placeholder="e.g. ar, en"
                          className="flex-1 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-mono"
                        />
                        <button
                          onClick={() => handleSave(c.locale)}
                          disabled={saving}
                          className="text-xs text-emerald-600 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditLocale(null)}
                          className="text-xs text-zinc-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : isBase ? (
                      <span className="text-xs text-zinc-300 italic">(base — no fallback)</span>
                    ) : (
                      <div className="flex items-center gap-1 flex-wrap">
                        {c.fallback_chain.map((fc, i) => (
                          <span key={fc} className="flex items-center gap-1">
                            {i > 0 && <span className="text-zinc-300">&rarr;</span>}
                            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-mono text-zinc-600">{fc}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-end" onClick={(e) => e.stopPropagation()}>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditLocale(c.locale);
                          setEditChain(c.fallback_chain.join(', '));
                        }}
                        className="text-xs text-zinc-400 hover:text-zinc-600"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resolution Preview */}
      {preview && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-3">
            Resolution Preview — {selectedLocale}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {preview.map((locale, i) => (
              <span key={locale} className="flex items-center gap-2">
                {i > 0 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300">
                    <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span
                  className={`rounded-lg px-3 py-1.5 text-sm font-mono ${
                    i === 0
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {locale}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
