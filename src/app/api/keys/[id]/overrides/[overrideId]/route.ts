import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// DELETE /api/keys/[keyId]/overrides/[overrideId] — remove a region override
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; overrideId: string }> }
) {
  const { id: keyId, overrideId } = await params;
  const db = getDb();

  const existing = await db.execute({
    sql: 'SELECT * FROM region_overrides WHERE id = ? AND key_id = ?',
    args: [overrideId, keyId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Override not found' }, { status: 404 });
  }

  await db.execute({
    sql: 'DELETE FROM region_overrides WHERE id = ?',
    args: [overrideId],
  });

  const row = existing.rows[0];
  await logAudit(
    'delete',
    'region_override',
    `${row.key_id}:${row.locale}:${row.region}`,
    row,
    null,
    'admin'
  );

  return NextResponse.json({ deleted: true });
}
