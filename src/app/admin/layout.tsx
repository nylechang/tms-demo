'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Statusbar from '@/components/admin/Statusbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<{
    keyCount?: number;
    version?: number;
    localeCount?: number;
  }>({});

  useEffect(() => {
    // Fetch summary stats for sidebar badge and statusbar
    Promise.all([
      fetch('/api/keys').then((r) => r.json()),
      fetch('/api/versions').then((r) => r.json()),
      fetch('/api/fallback-chains').then((r) => r.json()),
    ]).then(([keys, versions, chains]) => {
      const activeVersion = Array.isArray(versions)
        ? versions.find((v: { status: string }) => v.status === 'active')
        : null;
      setStats({
        keyCount: Array.isArray(keys) ? keys.length : 0,
        version: activeVersion?.version,
        localeCount: Array.isArray(chains) ? chains.length : 0,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 font-sans">
      <Sidebar keyCount={stats.keyCount} />

      {/* Content area */}
      <main className="ms-[220px] min-h-screen pb-10">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>

      <Statusbar
        version={stats.version}
        localeCount={stats.localeCount}
        keyCount={stats.keyCount}
      />
    </div>
  );
}
