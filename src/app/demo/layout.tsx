'use client';

import { I18nProvider } from '@/lib/i18n/provider';
import DemoNav from './DemoNav';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider locale="en" initialNamespaces={['common']}>
      <div className="min-h-screen bg-[#181a20] text-zinc-100">
        <DemoNav />
        {children}
      </div>
    </I18nProvider>
  );
}
