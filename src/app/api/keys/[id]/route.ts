import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// GET /api/keys/[id] — get key detail with all translations
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const key = await db.execute({
    sql: 'SELECT * FROM translation_keys WHERE id = ?',
    args: [id],
  });
  if (key.rows.length === 0) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  }

  const translations = await db.execute({
    sql: 'SELECT * FROM translations WHERE key_id = ? ORDER BY locale',
    args: [id],
  });

  const overrides = await db.execute({
    sql: 'SELECT * FROM region_overrides WHERE key_id = ? ORDER BY locale, region',
    args: [id],
  });

  return NextResponse.json({
    ...key.rows[0],
    translations: translations.rows,
    overrides: overrides.rows,
  });
}

// PATCH /api/keys/[id] — update key metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();

  const existing = await db.execute({
    sql: 'SELECT * FROM translation_keys WHERE id = ?',
    args: [id],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  }

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (body.description !== undefined) {
    updates.push('description = ?');
    args.push(body.description);
  }
  if (body.tags !== undefined) {
    updates.push('tags = ?');
    args.push(JSON.stringify(body.tags));
  }
  if (body.status !== undefined) {
    updates.push('status = ?');
    args.push(body.status);
  }
  if (body.max_length !== undefined) {
    updates.push('max_length = ?');
    args.push(body.max_length);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  args.push(id);
  await db.execute({
    sql: `UPDATE translation_keys SET ${updates.join(', ')} WHERE id = ?`,
    args,
  });

  await logAudit('update', 'translation_key', id, existing.rows[0], body, 'admin');
  return NextResponse.json({ updated: true });
}
