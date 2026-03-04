'use client';

// Balance scale SVG icon for legal/compliance indicator
function ScaleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Center pillar */}
      <line x1="8" y1="2" x2="8" y2="14" />
      {/* Base */}
      <line x1="5" y1="14" x2="11" y2="14" />
      {/* Beam */}
      <line x1="2" y1="4" x2="14" y2="4" />
      {/* Left pan */}
      <path d="M2 4 L0.5 9 Q2 11 3.5 9 Z" />
      {/* Right pan */}
      <path d="M14 4 L12.5 9 Q14 11 15.5 9 Z" />
    </svg>
  );
}

export default function ComplianceBadge({
  expanded = false,
}: {
  expanded?: boolean;
}) {
  if (expanded) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-2.5 py-1 text-violet-700 border border-violet-200">
        <ScaleIcon size={15} />
        <span className="text-xs font-medium">Legal</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-violet-600 border border-violet-200">
      <ScaleIcon size={12} />
      <span className="text-[11px] font-medium">Legal</span>
    </span>
  );
}
