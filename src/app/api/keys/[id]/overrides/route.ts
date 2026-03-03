import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// GET /api/keys/[keyId]/overrides — list overrides for a key
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: keyId } = await params;
  const db = getDb();

  const result = await db.execute({
    sql: 'SELECT * FROM region_overrides WHERE key_id = ? ORDER BY locale, region',
    args: [keyId],
  });

  return NextResponse.json(result.rows);
}

// PUT /api/keys/[keyId]/overrides — upsert a region override
// Resets legal_approved_by on edit (per CLAUDE.md)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: keyId } = await params;
  const db = getDb();
  const body = await request.json();
  const { locale, region, value } = body;

  if (!locale || !region || !value) {
    return NextResponse.json({ error: 'locale, region, and value are required' }, { status: 400 });
  }

  // Snapshot old value
  const existing = await db.execute({
    sql: 'SELECT * FROM region_overrides WHERE key_id = ? AND locale = ? AND region = ?',
    args: [keyId, locale, region],
  });

  await db.execute({
    sql: `INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by, updated_at)
          VALUES (?, ?, ?, ?, NULL, datetime('now'))
          ON CONFLICT(key_id, locale, region) DO UPDATE SET
            value = excluded.value,
            legal_approved_by = NULL,
            updated_at = datetime('now')`,
    args: [keyId, locale, region, value],
  });

  const action = existing.rows.length > 0 ? 'update' : 'create';
  await logAudit(action, 'region_override', `${keyId}:${locale}:${region}`, existing.rows[0] || null, { value }, 'admin');

  return NextResponse.json({ key_id: keyId, locale, region });
}
