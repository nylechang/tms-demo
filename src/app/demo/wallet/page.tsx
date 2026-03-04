'use client';

import { useState } from 'react';
import { useTranslation, useLocale } from '@/lib/i18n/provider';

export default function WalletPage() {
  const { t: tWallet, isLoading: walletLoading } = useTranslation('wallet');
  const { t: tCommon, isLoading: commonLoading } = useTranslation('common');
  const { direction } = useLocale();
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');

  const isLoading = walletLoading || commonLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      {/* Balance card */}
      <div className="mb-4 rounded-lg border border-zinc-800 bg-[#1e2026] p-6">
        <div className="text-xs text-zinc-500">{tWallet('balance.label')}</div>
        <div className="mt-1 text-2xl font-bold font-mono" dir={direction}>
          {tWallet('balance.display', { balance: 12450.5 })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Deposit/Withdraw */}
        <Card>
          {/* Tabs */}
          <div className="mb-4 flex gap-1 border-b border-zinc-800 pb-3">
            {(['deposit', 'withdraw'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t
                    ? 'bg-[#f0b90b] text-[#181a20]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tWallet(`${t}.title`)}
              </button>
            ))}
          </div>

          {tab === 'deposit' ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">{tWallet('deposit.asset_label')}</label>
                <div className="rounded bg-zinc-800 px-3 py-2 text-sm">USDT (TRC-20)</div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">{tWallet('deposit.address_label')}</label>
                <div className="rounded bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-300 break-all">
                  TXn9k3Hp...7vRqZ
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded bg-zinc-800/60 p-3 text-sm" dir={direction}>
                {tWallet('withdraw.amount', { amount: 1500 })}
              </div>
              <div className="rounded bg-zinc-800/60 p-3 text-sm" dir={direction}>
                {tWallet('transfer.confirm', { amount: 0.25, asset: 'ETH', recipient: '0x7a3B...9f2E' })}
              </div>
              <button className="w-full rounded bg-[#f0b90b] py-2 text-sm font-semibold text-[#181a20]">
                {tCommon('btn.confirm')}
              </button>
            </div>
          )}
        </Card>

        {/* Right: Earn section */}
        <Card>
          <h3 className="mb-3 text-base font-semibold text-[#f0b90b]">
            {tWallet('earn.title')}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded bg-zinc-800/60 p-3">
              <span className="text-xs text-zinc-500">{tWallet('earn.holdings')}</span>
              <span className="font-mono text-sm">$8,250.00</span>
            </div>
            <div className="flex items-center justify-between rounded bg-zinc-800/60 p-3">
              <span className="text-xs text-zinc-500">{tWallet('earn.total_profit')}</span>
              <span className="font-mono text-sm text-emerald-400">+$312.45</span>
            </div>
            <div className="flex items-center justify-between rounded bg-zinc-800/60 p-3">
              <span className="text-xs text-zinc-500">{tWallet('earn.last_day_profit')}</span>
              <span className="font-mono text-sm text-emerald-400">+$4.12</span>
            </div>
          </div>

        </Card>
      </div>

      {/* Compliance disclaimer */}
      <div className="mt-4 rounded border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-200/80">
        {tWallet('withdraw.disclaimer')}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#1e2026] p-4">
      {children}
    </div>
  );
}
