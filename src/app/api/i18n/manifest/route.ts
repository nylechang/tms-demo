import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/i18n/manifest — current manifest with injected version/timestamp
export async function GET() {
  const db = getDb();

  // Get latest active version
  const versionResult = await db.execute(
    "SELECT version, published_at FROM publish_versions WHERE status = 'active' ORDER BY version DESC LIMIT 1"
  );
  if (versionResult.rows.length === 0) {
    return NextResponse.json({ error: 'No published versions' }, { status: 404 });
  }

  const version = versionResult.rows[0].version as number;
  const publishedAt = versionResult.rows[0].published_at as string;

  // Get manifest content from published_bundles
  const manifestResult = await db.execute({
    sql: `SELECT content FROM published_bundles
          WHERE version = ? AND locale = '_manifest' AND namespace = '_manifest'`,
    args: [version],
  });
  if (manifestResult.rows.length === 0) {
    return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
  }

  const manifest = JSON.parse(manifestResult.rows[0].content as string);

  // Inject version and timestamp dynamically (per CLAUDE.md — manifest content is version-agnostic)
  return NextResponse.json({
    version,
    timestamp: publishedAt,
    ...manifest,
  });
}
