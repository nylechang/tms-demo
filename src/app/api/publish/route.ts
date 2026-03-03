import { NextRequest, NextResponse } from 'next/server';
import { publish } from '@/lib/publish';

// POST /api/publish — run the publish pipeline
// Pass { dry_run: true } to validate without writing to DB
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const publishedBy = body.published_by || 'admin';
  const notes = body.notes || undefined;
  const dryRun = body.dry_run === true;

  const report = await publish(publishedBy, notes, dryRun);
  return NextResponse.json(report);
}
