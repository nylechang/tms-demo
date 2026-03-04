'use client';

import { useState } from 'react';
import { useTranslation, useLocale } from '@/lib/i18n/provider';

const MOCK_ORDERS = [
  { id: 'ORD-7291', pair: 'BTC/USDT', side: 'buy', amount: 0.25, price: 72150, status: 'filled' },
  { id: 'ORD-7292', pair: 'ETH/USDT', side: 'sell', amount: 3.5, price: 2280, status: 'pending' },
  { id: 'ORD-7293', pair: 'BNB/USDT', side: 'buy', amount: 10, price: 688, status: 'cancelled' },
] as const;

export default function TradePage() {
  const { t: tTrade, isLoading: tradeLoading } = useTranslation('trade');
  const { t: tCommon, isLoading: commonLoading } = useTranslation('common');
  const { direction } = useLocale();
  const [orderCount, setOrderCount] = useState(3);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'trailing'>('limit');

  const isLoading = tradeLoading || commonLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      {/* Header: Pair info */}
      <div className="mb-4 flex items-end gap-8 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold">BTC/USDT</h1>
          <span className="text-xs text-zinc-500">Bitcoin</span>
        </div>
        <Stat label={tTrade('pair.last_price')} value="72,150.00" mono />
        <Stat label={tTrade('pair.change_24h')} value="+2.34%" valueClass="text-emerald-400" />
        <Stat label={tTrade('pair.vol_24h')} value="1.2B" />
      </div>

      {/* Order form */}
      <Card>
        {/* Order type tabs */}
        <div className="mb-4 flex gap-1 border-b border-zinc-800 pb-3">
          {(['market', 'limit', 'trailing'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                orderType === type
                  ? 'bg-[#f0b90b] text-[#181a20]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tTrade(`order.type.${type}`)}
            </button>
          ))}
        </div>

        {/* Mock order form */}
        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">{tTrade('order.price_label', { currency: 'USDT' })}</label>
            <input
              type="text"
              readOnly
              value={orderType === 'market' ? '—' : '72,150.00'}
              className="w-full rounded bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-200 outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">{tTrade('order.amount_label', { currency: 'BTC' })}</label>
            <input
              type="text"
              readOnly
              value="1"
              className="w-full rounded bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-200 outline-none"
            />
          </div>
        </div>

        {/* Buy / Cancel buttons */}
        <div className="flex gap-2">
          <button className="flex-1 rounded bg-emerald-500 py-2 text-sm font-semibold text-white">
            {tTrade('order.side.buy', { asset: 'BTC' })}
          </button>
          <button className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-400">
            {tCommon('btn.cancel')}
          </button>
        </div>

        {/* Purchase confirmation message */}
        <div className="mt-4 rounded bg-zinc-800/60 p-3 text-sm" dir={direction}>
          <span className="text-zinc-500">{tTrade('order.result_label')} </span>
          {tTrade('order.purchased', { amount: 1, asset: 'BTC', price: 72150 })}
        </div>
      </Card>

      {/* Open orders table */}
      <Card className="mt-4">
        {/* Header with plural demo */}
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-sm font-semibold text-zinc-300">
            {tTrade('order.count', { count: orderCount })}
          </h3>
          <span className="h-4 w-px bg-zinc-700" />
          <span className="text-xs text-zinc-500">{tCommon('adjust_count')}</span>
          <button
            onClick={() => setOrderCount(Math.max(0, orderCount - 1))}
            className="rounded bg-zinc-800 px-2 py-0.5 text-sm hover:bg-zinc-700"
          >
            −
          </button>
          <span className="w-6 text-center font-mono text-sm">{orderCount}</span>
          <button
            onClick={() => setOrderCount(orderCount + 1)}
            className="rounded bg-zinc-800 px-2 py-0.5 text-sm hover:bg-zinc-700"
          >
            +
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs text-zinc-500">
              <th className="py-2 text-start">{tTrade('table.id')}</th>
              <th className="py-2 text-start">{tTrade('table.pair')}</th>
              <th className="py-2 text-start">{tTrade('table.side')}</th>
              <th className="py-2 text-end font-mono">{tTrade('table.amount')}</th>
              <th className="py-2 text-end font-mono">{tTrade('table.price')}</th>
              <th className="py-2 text-end">{tTrade('table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id} className="border-b border-zinc-800/50">
                <td className="py-2 font-mono text-zinc-400">{order.id}</td>
                <td className="py-2">{order.pair}</td>
                <td className={`py-2 ${order.side === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tTrade('order.side', { side: order.side })}
                </td>
                <td className="py-2 text-end font-mono">{order.amount}</td>
                <td className="py-2 text-end font-mono">{order.price.toLocaleString()}</td>
                <td className="py-2 text-end">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs ${
                    order.status === 'filled'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : order.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-zinc-700/50 text-zinc-400'
                  }`}>
                    {tTrade('order.status', { status: order.status })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Risk warning */}
      <div className="mt-4 rounded border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-200/80">
        {tTrade('risk.warning')}
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-[#1e2026] p-4 ${className}`}>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  valueClass = '',
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={`text-sm font-medium ${mono ? 'font-mono' : ''} ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}
