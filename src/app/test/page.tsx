'use client';

import { I18nProvider, useTranslation, useLocale } from '@/lib/i18n/provider';
import { useState, useEffect } from 'react';

// --- Inner test component (must be inside I18nProvider) ---

function TestPanel() {
  const { locale, region, setLocale, setRegion, direction, locales } = useLocale();
  const { t: tCommon, isLoading: commonLoading } = useTranslation('common');
  const { t: tTrade, isLoading: tradeLoading } = useTranslation('trade');
  const [count, setCount] = useState(2);
  const [docDir, setDocDir] = useState('');

  // Read document.dir after provider sets it (depends on locale, not direction,
  // because direction may stay 'ltr' across locale changes)
  useEffect(() => {
    // Small delay to let the provider's own effect set document.dir first
    const id = requestAnimationFrame(() => {
      setDocDir(document.documentElement.dir);
    });
    return () => cancelAnimationFrame(id);
  }, [locale, direction]);

  return (
    <div className="mx-auto max-w-2xl p-8 font-sans">
      <h1 className="mb-6 text-2xl font-bold">i18n SDK Test Page</h1>

      {/* --- Controls --- */}
      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Controls</h2>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="font-medium">Locale:</label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded border px-2 py-1"
          >
            {locales.map(({ locale: loc, config }) => (
              <option key={loc} value={loc}>
                {config.display_name} ({loc})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="font-medium">Region:</label>
          {['', 'US', 'EU', 'MENA'].map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`rounded border px-3 py-1 text-sm ${
                region === r ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {r || 'None'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="font-medium">Plural count:</label>
          <input
            type="number"
            min={0}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded border px-2 py-1"
          />
        </div>
      </section>

      {/* --- Status --- */}
      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Status</h2>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Locale" value={locale} />
            <Row label="Region" value={region || '(none)'} />
            <Row label="Direction" value={direction} />
            <Row label="document.dir" value={docDir || '(pending)'} />
            <Row label="common loading" value={String(commonLoading)} />
            <Row label="trade loading" value={String(tradeLoading)} />
          </tbody>
        </table>
      </section>

      {/* --- Translations: common namespace --- */}
      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">common namespace</h2>
        {commonLoading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-start">Key</th>
                <th className="py-1 text-start">Value</th>
              </tr>
            </thead>
            <tbody>
              <Row label="nav.home" value={tCommon('nav.home')} />
              <Row label="nav.trade" value={tCommon('nav.trade')} />
              <Row label="nav.wallet" value={tCommon('nav.wallet')} />
              <Row label="btn.confirm" value={tCommon('btn.confirm')} />
              <Row label="btn.cancel" value={tCommon('btn.cancel')} />
              <Row label="error.network" value={tCommon('error.network')} />
              <Row
                label={`inbox.count (${count})`}
                value={tCommon('inbox.count', { count })}
              />
              <Row
                label="nonexistent.key"
                value={tCommon('nonexistent.key')}
                highlight
              />
            </tbody>
          </table>
        )}
      </section>

      {/* --- Translations: trade namespace --- */}
      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">trade namespace</h2>
        {tradeLoading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-start">Key</th>
                <th className="py-1 text-start">Value</th>
              </tr>
            </thead>
            <tbody>
              <Row label="order.confirm_btn" value={tTrade('order.confirm_btn')} />
              <Row label="order.cancel_link" value={tTrade('order.cancel_link')} />
              <Row
                label="order.purchased"
                value={tTrade('order.purchased', { amount: 0.5, asset: 'BTC', price: 42000 })}
              />
              <Row
                label={`order.count (${count})`}
                value={tTrade('order.count', { count })}
              />
              <Row
                label="order.status (filled)"
                value={tTrade('order.status', { status: 'filled' })}
              />
              <Row label="risk.warning" value={tTrade('risk.warning')} />
            </tbody>
          </table>
        )}
      </section>

      {/* --- Fallback test --- */}
      <section className="mb-8 rounded border bg-amber-50 p-4">
        <h2 className="mb-3 text-lg font-semibold">Fallback verification</h2>
        <p className="mb-2 text-sm text-zinc-600">
          Switch to <strong>zh-Hant-TW</strong> or <strong>ko</strong> — keys
          without direct translations should fall back through the chain. A
          missing key returns the raw key ID (never empty).
        </p>
        <table className="w-full text-sm">
          <tbody>
            <Row
              label="nonexistent.key → raw key"
              value={tCommon('nonexistent.key')}
              highlight
            />
          </tbody>
        </table>
      </section>

      {/* --- RTL test --- */}
      <section className="mb-8 rounded border bg-emerald-50 p-4">
        <h2 className="mb-3 text-lg font-semibold">RTL verification</h2>
        <p className="mb-2 text-sm text-zinc-600">
          Switch to <strong>ar</strong> — the entire page should mirror.
          Direction is read from manifest metadata, not hardcoded.
        </p>
        <div className="rounded bg-white p-3 text-sm">
          <p>
            <strong>dir:</strong> {direction} |{' '}
            <strong>document.dir:</strong>{' '}
            {docDir || '(pending)'}
          </p>
          {!tradeLoading && (
            <p className="mt-2" dir={direction}>
              {tTrade('order.purchased', { amount: 0.5, asset: 'BTC', price: 42000 })}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-1 pe-4 font-mono text-zinc-500">{label}</td>
      <td
        className={`py-1 ${
          highlight ? 'font-semibold text-orange-600' : ''
        }`}
      >
        {value}
      </td>
    </tr>
  );
}

// --- Page wrapper with provider ---

export default function TestPage() {
  return (
    <I18nProvider locale="en" initialNamespaces={['common', 'trade']}>
      <TestPanel />
    </I18nProvider>
  );
}
