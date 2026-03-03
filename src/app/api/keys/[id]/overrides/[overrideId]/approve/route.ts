import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// POST /api/keys/[keyId]/overrides/[overrideId]/approve — legal approve an override
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; overrideId: string }> }
) {
  const { overrideId } = await params;
  const db = getDb();
  const body = await request.json().catch(() => ({}));
  const performedBy = body.performed_by || 'legal_team';

  const existing = await db.execute({
    sql: 'SELECT * FROM region_overrides WHERE id = ?',
    args: [overrideId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Override not found' }, { status: 404 });
  }

  await db.execute({
    sql: "UPDATE region_overrides SET legal_approved_by = ?, updated_at = datetime('now') WHERE id = ?",
    args: [performedBy, overrideId],
  });

  const row = existing.rows[0];
  await logAudit(
    'legal_approve',
    'region_override',
    `${row.key_id}:${row.locale}:${row.region}`,
    { legal_approved_by: null },
    { legal_approved_by: performedBy },
    performedBy
  );

  return NextResponse.json({ approved: true });
}
