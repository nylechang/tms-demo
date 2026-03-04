'use client';

const STATUS_STYLES: Record<string, string> = {
  // Key status
  active: 'border-emerald-400 text-emerald-700',
  deprecated: 'border-zinc-300 text-zinc-500',
  // Translation workflow
  draft: 'border-zinc-300 text-zinc-500',
  review: 'border-amber-400 text-amber-700',
  approved: 'border-emerald-400 text-emerald-700',
  legal_review: 'border-amber-400 text-amber-700',
  legal_approved: 'border-emerald-400 text-emerald-700',
  // Publish versions
  rolled_back: 'border-zinc-300 text-zinc-400 line-through',
};

const LABELS: Record<string, string> = {
  active: 'ACTIVE',
  deprecated: 'DEPRECATED',
  draft: 'DRAFT',
  review: 'REVIEW',
  approved: 'APPROVED',
  legal_review: 'LEGAL REVIEW',
  legal_approved: 'LEGAL APPROVED',
  rolled_back: 'ROLLED BACK',
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'border-zinc-300 text-zinc-500';
  const label = LABELS[status] ?? status.toUpperCase().replace(/_/g, ' ');

  return (
    <span
      className={`inline-block min-w-[7.5rem] rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium tracking-wide text-center ${style}`}
    >
      {label}
    </span>
  );
}
