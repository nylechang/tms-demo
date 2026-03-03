import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/versions — list all published versions
export async function GET() {
  const db = getDb();
  const result = await db.execute(
    'SELECT * FROM publish_versions ORDER BY version DESC'
  );
  return NextResponse.json(result.rows);
}
