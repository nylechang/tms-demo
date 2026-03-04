'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 sm:pt-24 p-6 relative overflow-hidden bg-zinc-950">
      <LiquidBackground />

      <main className="max-w-3xl w-full z-10 flex flex-col gap-16">
        {/* Hero Section */}
        <div className="space-y-8 text-center sm:text-left">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
            i18n Infrastructure Demo
          </h1>

          <div className="max-w-2xl space-y-6 text-xl sm:text-2xl text-zinc-400 leading-relaxed font-light">
            <p>
              A regulator asks: <span className="text-zinc-100 italic">&quot;What legal text did your US users see last Tuesday at 4pm?&quot;</span>
            </p>

            <p>
              Most i18n systems can&apos;t answer that. <span className="inline-block font-medium text-white">This one can.</span>
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            href="/demo/trade"
            title="Frontend Demo"
            description="ICU formatting, RTL, locale × region resolution"
            icon={<LayoutIcon />}
          />
          <Card
            href="/admin/keys"
            title="TMS Admin"
            description="Compliance workflow, versioned publish, audit trail"
            icon={<SettingsIcon />}
          />
          <Card
            href="https://github.com/nylechang/tms-demo"
            title="GitHub"
            description="Architecture docs and full source"
            icon={<GithubIcon />}
          />
          <Card
            href="#"
            title="Walkthrough"
            description="3-min video walkthrough (Coming Soon)"
            icon={<PlayIcon />}
            disabled
          />
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/5 text-center sm:text-left">
          <p className="text-sm text-zinc-600 font-mono">
            Demo project &middot; Next.js &middot; Turso &middot; Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}

function LiquidBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-indigo-500/8 rounded-full blur-[120px]"
        animate={{
          x: ["0%", "40%", "0%"],
          y: ["0%", "25%", "0%"],
          scale: [1, 1.1, 1],
          rotate: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[10%] -right-[20%] w-[60vw] h-[60vw] bg-purple-500/8 rounded-full blur-[120px]"
        animate={{
          x: ["0%", "-30%", "0%"],
          y: ["0%", "35%", "0%"],
          scale: [1, 1.2, 1],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] bg-blue-500/5 rounded-full blur-[140px]"
        animate={{
          x: ["0%", "30%", "0%"],
          y: ["0%", "-25%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}

function Card({
  href,
  title,
  description,
  icon,
  disabled = false
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <a
      href={disabled ? undefined : href}
      className={`
        group relative p-6 rounded-2xl border border-white/10 bg-white/5
        transition-all duration-300 ease-out
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/5 ${!disabled && 'group-hover:bg-indigo-500/20 group-hover:text-indigo-300'} transition-colors`}>
          {icon}
        </div>
        {!disabled && (
          <ArrowUpRightIcon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
          {description}
        </p>
      </div>
    </a>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" {...props}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" {...props}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
