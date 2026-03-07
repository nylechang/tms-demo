import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/i18n/bundles/[version]/[locale]/[namespace]/[region] — override bundle
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ version: string; locale: string; namespace: string; region: string }> }
) {
  const { version, locale, namespace, region } = await params;
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT content FROM published_bundles
          WHERE version = ? AND locale = ? AND namespace = ? AND bundle_type = 'override' AND region = ?`,
    args: [parseInt(version, 10), locale, namespace, region],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({}, {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  }

  const content = JSON.parse(result.rows[0].content as string);

  return NextResponse.json(content, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
