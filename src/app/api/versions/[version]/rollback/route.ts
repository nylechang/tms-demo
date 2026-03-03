import { NextRequest, NextResponse } from 'next/server';
import { rollback } from '@/lib/publish';

// POST /api/versions/[version]/rollback — rollback to this version
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  const { version } = await params;
  const body = await request.json().catch(() => ({}));
  const performedBy = body.performed_by || 'admin';

  const targetVersion = parseInt(version, 10);
  if (isNaN(targetVersion)) {
    return NextResponse.json({ error: 'Invalid version number' }, { status: 400 });
  }

  try {
    const newVersion = await rollback(targetVersion, performedBy);
    return NextResponse.json({ new_version: newVersion, rolled_back_to: targetVersion });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
