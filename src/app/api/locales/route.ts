import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/locales — list all enabled locales from locale_metadata
export async function GET() {
  const db = getDb();
  const result = await db.execute(
    'SELECT locale, display_name, english_name, direction FROM locale_metadata WHERE enabled = 1 ORDER BY locale'
  );

  const locales = result.rows.map(row => ({
    locale: row.locale,
    display_name: row.display_name,
    english_name: row.english_name,
    direction: row.direction || 'ltr',
  }));

  return NextResponse.json(locales);
}
