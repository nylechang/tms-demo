import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// GET /api/keys — list keys with optional filters
export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const namespace = searchParams.get('namespace');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status');
  const translationStatus = searchParams.get('translation_status');
  const search = searchParams.get('search');

  let sql = `
    SELECT tk.*, n.description as namespace_description
    FROM translation_keys tk
    JOIN namespaces n ON tk.namespace_id = n.id
    WHERE 1=1
  `;
  const args: string[] = [];

  if (namespace) {
    sql += ' AND tk.namespace_id = ?';
    args.push(namespace);
  }
  if (tag) {
    sql += ' AND EXISTS(SELECT 1 FROM json_each(tk.tags) WHERE json_each.value = ?)';
    args.push(tag);
  }
  if (status) {
    sql += ' AND tk.status = ?';
    args.push(status);
  }
  if (translationStatus) {
    sql += ' AND EXISTS(SELECT 1 FROM translations t WHERE t.key_id = tk.id AND t.status = ?)';
    args.push(translationStatus);
  }
  if (search) {
    sql += ' AND (tk.id LIKE ? OR tk.description LIKE ?)';
    args.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY tk.namespace_id, tk.id';

  const result = await db.execute({ sql, args });
  return NextResponse.json(result.rows);
}

// POST /api/keys — create a new translation key
export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const { id, namespace_id, description, tags } = body;

  if (!id || !namespace_id) {
    return NextResponse.json({ error: 'id and namespace_id are required' }, { status: 400 });
  }

  // Verify namespace exists
  const ns = await db.execute({ sql: 'SELECT id FROM namespaces WHERE id = ?', args: [namespace_id] });
  if (ns.rows.length === 0) {
    return NextResponse.json({ error: `Namespace '${namespace_id}' not found` }, { status: 400 });
  }

  await db.execute({
    sql: `INSERT INTO translation_keys (id, namespace_id, description, tags)
          VALUES (?, ?, ?, ?)`,
    args: [id, namespace_id, description || null, JSON.stringify(tags || [])],
  });

  await logAudit('create', 'translation_key', id, null, { id, namespace_id, tags }, 'admin');
  return NextResponse.json({ id }, { status: 201 });
}
