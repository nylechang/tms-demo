'use client';

export default function Statusbar({
  version,
  localeCount,
  keyCount,
}: {
  version?: number;
  localeCount?: number;
  keyCount?: number;
}) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 flex h-7 items-center border-t border-zinc-200 bg-zinc-50 ps-[220px]">
      <div className="flex items-center gap-4 px-4 text-[11px] font-mono text-zinc-400">
        {version != null && <span>v{version} published</span>}
        {localeCount != null && <span>&middot; {localeCount} locales</span>}
        {keyCount != null && <span>&middot; {keyCount} keys</span>}
      </div>
    </footer>
  );
}
