import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// PUT /api/fallback-chains/[locale] — update fallback chain
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const db = getDb();
  const body = await request.json();
  const { fallback_chain } = body;

  if (!Array.isArray(fallback_chain)) {
    return NextResponse.json({ error: 'fallback_chain must be an array' }, { status: 400 });
  }

  // Get old value for audit
  const existing = await db.execute({
    sql: 'SELECT fallback_chain FROM fallback_configs WHERE locale = ?',
    args: [locale],
  });

  await db.execute({
    sql: `INSERT INTO fallback_configs (locale, fallback_chain) VALUES (?, ?)
          ON CONFLICT(locale) DO UPDATE SET fallback_chain = excluded.fallback_chain`,
    args: [locale, JSON.stringify(fallback_chain)],
  });

  await logAudit(
    'update',
    'fallback_config',
    locale,
    existing.rows[0] ? { fallback_chain: JSON.parse(existing.rows[0].fallback_chain as string) } : null,
    { fallback_chain },
    'admin'
  );

  return NextResponse.json({ locale, fallback_chain });
}
