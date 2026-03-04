import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/audit-log — list audit entries with filters
export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const entityType = searchParams.get('entity_type');
  const entityId = searchParams.get('entity_id');
  const performedBy = searchParams.get('performed_by');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  let sql = 'SELECT * FROM audit_log WHERE 1=1';
  const args: string[] = [];

  if (action) {
    sql += ' AND action = ?';
    args.push(action);
  }
  if (entityType) {
    sql += ' AND entity_type = ?';
    args.push(entityType);
  }
  if (entityId) {
    sql += ' AND entity_id = ?';
    args.push(entityId);
  }
  if (performedBy) {
    sql += ' AND performed_by = ?';
    args.push(performedBy);
  }
  if (from) {
    sql += ' AND timestamp >= ?';
    args.push(from);
  }
  if (to) {
    sql += ' AND timestamp <= ?';
    args.push(to);
  }

  sql += ' ORDER BY timestamp DESC, id DESC LIMIT ? OFFSET ?';
  args.push(String(limit + 1), String(offset));

  const result = await db.execute({ sql, args });
  const rows = result.rows;
  const hasMore = rows.length > limit;
  return NextResponse.json({ entries: hasMore ? rows.slice(0, limit) : rows, hasMore });
}
