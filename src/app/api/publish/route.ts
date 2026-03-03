import { NextRequest, NextResponse } from 'next/server';
import { publish } from '@/lib/publish';

// POST /api/publish — run the publish pipeline
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const publishedBy = body.published_by || 'admin';
  const notes = body.notes || undefined;

  const report = await publish(publishedBy, notes);
  return NextResponse.json(report);
}
