import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// PUT /api/keys/[keyId]/translations/[locale] — upsert translation
// Per compliance-model.md: upsert resets status→draft, approved_by→NULL, legal_approved_by→NULL
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const { id: keyId, locale } = await params;
  const db = getDb();
  const body = await request.json();
  const { value } = body;

  if (!value) {
    return NextResponse.json({ error: 'value is required' }, { status: 400 });
  }

  // Verify key exists
  const key = await db.execute({
    sql: 'SELECT id FROM translation_keys WHERE id = ?',
    args: [keyId],
  });
  if (key.rows.length === 0) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  }

  // Snapshot old value for audit
  const existing = await db.execute({
    sql: 'SELECT * FROM translations WHERE key_id = ? AND locale = ?',
    args: [keyId, locale],
  });

  // Upsert with reset
  await db.execute({
    sql: `INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by, updated_at)
          VALUES (?, ?, ?, 'draft', NULL, NULL, datetime('now'))
          ON CONFLICT(key_id, locale) DO UPDATE SET
            value = excluded.value,
            status = 'draft',
            approved_by = NULL,
            legal_approved_by = NULL,
            updated_at = datetime('now')`,
    args: [keyId, locale, value],
  });

  // Audit: snapshot old row if it existed
  if (existing.rows.length > 0) {
    await logAudit('update', 'translation', `${keyId}:${locale}`, existing.rows[0], { value, status: 'draft' }, 'admin');
  } else {
    await logAudit('create', 'translation', `${keyId}:${locale}`, null, { value, status: 'draft' }, 'admin');
  }

  return NextResponse.json({ key_id: keyId, locale, status: 'draft' });
}
