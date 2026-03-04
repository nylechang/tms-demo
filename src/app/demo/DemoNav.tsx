'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslation } from '@/lib/i18n/provider';

const REGIONS = [
  { value: '', label: 'KYC: -' },
  { value: 'EU', label: 'KYC: EU' },
  { value: 'US', label: 'KYC: US' },
  { value: 'MENA', label: 'KYC: MENA' },
];

export default function DemoNav() {
  const pathname = usePathname();
  const { locale, region, setLocale, setRegion, locales } = useLocale();
  const { t, isLoading } = useTranslation('common');
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxCount, setInboxCount] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInboxOpen(false);
      }
    }
    if (inboxOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [inboxOpen]);

  const navLinks = [
    { href: '/demo/trade', label: isLoading ? '...' : t('nav.trade') },
    { href: '/demo/wallet', label: isLoading ? '...' : t('nav.wallet') },
  ];

  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-[#1e2026] px-4 py-2">
      {/* Left: Logo + nav links */}
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-[#f0b90b]">Demo</span>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              pathname === link.href
                ? 'text-[#f0b90b]'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right: Inbox icon + Locale + Region */}
      <div className="flex items-center gap-3">
        {/* Inbox notification icon — cross-namespace demo (common:inbox.count) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setInboxOpen(!inboxOpen)}
            className="relative rounded p-1.5 text-zinc-400 transition-colors hover:text-zinc-100"
            aria-label="Inbox"
          >
            {/* Bell icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {inboxCount > 0 && (
              <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0b90b] px-1 text-[10px] font-bold text-[#181a20]">
                {inboxCount}
              </span>
            )}
          </button>

          {inboxOpen && (
            <div className="absolute end-0 top-full z-50 mt-2 w-64 rounded-lg border border-zinc-700 bg-[#1e2026] shadow-xl">
              <div className="border-b border-zinc-800 px-4 py-3">
                <div className="text-sm font-medium">
                  {isLoading ? '...' : t('inbox.count', { count: inboxCount })}
                </div>
                <div className="mt-1 text-[10px] text-zinc-500">
                </div>
              </div>

              {/* +/- controls to demo plural forms */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-zinc-500">{isLoading ? '...' : t('adjust_count')}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInboxCount(Math.max(0, inboxCount - 1))}
                    className="rounded bg-zinc-800 px-2 py-0.5 text-sm hover:bg-zinc-700"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-mono text-sm">{inboxCount}</span>
                  <button
                    onClick={() => setInboxCount(inboxCount + 1)}
                    className="rounded bg-zinc-800 px-2 py-0.5 text-sm hover:bg-zinc-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200 outline-none"
        >
          {locales.map(({ locale: loc, config }) => (
            <option key={loc} value={loc}>
              {config.display_name} ({loc})
            </option>
          ))}
        </select>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200 outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
