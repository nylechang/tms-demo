import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/fallback-chains — list all fallback chains
export async function GET() {
  const db = getDb();
  const result = await db.execute(
    'SELECT fc.locale, fc.fallback_chain, lm.display_name, lm.english_name, lm.direction FROM fallback_configs fc LEFT JOIN locale_metadata lm ON fc.locale = lm.locale ORDER BY fc.locale'
  );

  const chains = result.rows.map(row => ({
    locale: row.locale,
    fallback_chain: JSON.parse(row.fallback_chain as string),
    display_name: row.display_name,
    english_name: row.english_name,
    direction: row.direction || 'ltr',
  }));

  return NextResponse.json(chains);
}
