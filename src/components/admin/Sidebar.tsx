'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Inline SVG icons — small and purpose-built
function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <ellipse cx="10" cy="10" rx="3.5" ry="8" />
      <line x1="2" y1="10" x2="18" y2="10" />
    </svg>
  );
}

function KeysIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="10" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="6" height="6" rx="1" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 10.5a3 3 0 0 0 4.24 0l2.12-2.12a3 3 0 0 0-4.24-4.24L8.5 5.26" />
      <path d="M10.5 7.5a3 3 0 0 0-4.24 0L4.14 9.62a3 3 0 0 0 4.24 4.24L9.5 12.74" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2c0 0-5 3-5 9l2 3h6l2-3c0-6-5-9-5-9Z" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M6 14l-1 3" />
      <path d="M12 14l1 3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="7" />
      <polyline points="9,5 9,9 12,11" />
    </svg>
  );
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar({ keyCount }: { keyCount?: number }) {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      title: 'PLATFORM',
      items: [
        { href: '/admin/keys', label: 'All Keys', icon: <KeysIcon />, badge: keyCount },
      ],
    },
    {
      title: 'CONFIGURATION',
      items: [
        { href: '/admin/fallback-chains', label: 'Fallback Chains', icon: <LinkIcon /> },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { href: '/admin/publish', label: 'Publish', icon: <RocketIcon /> },
        { href: '/admin/audit', label: 'Audit Log', icon: <ClockIcon /> },
      ],
    },
  ];

  function isActive(href: string) {
    if (href === '/admin/keys') {
      return pathname === '/admin/keys' || pathname.startsWith('/admin/keys/');
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 start-0 z-30 flex w-[220px] flex-col bg-white border-e border-zinc-200">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="text-zinc-500">
          <GlobeIcon />
        </span>
        <div>
          <div className="text-sm font-semibold text-zinc-900">i18n Console</div>
          <div className="text-[11px] font-mono text-zinc-400">v0.1.0</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title} className="mt-6 first:mt-2">
            <div className="px-2 mb-1.5 text-[11px] font-medium text-zinc-400 tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge != null && (
                    <span
                      className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
