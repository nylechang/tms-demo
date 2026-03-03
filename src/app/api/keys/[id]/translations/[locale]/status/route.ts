import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logAudit } from '@/lib/audit';

// Valid transitions per compliance-model.md
const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['review'],
  review: ['approved', 'draft'],
  approved: ['legal_review', 'draft'],
  legal_review: ['legal_approved', 'approved'],
};

// POST /api/keys/[keyId]/translations/[locale]/status — status transition
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const { id: keyId, locale } = await params;
  const db = getDb();
  const body = await request.json();
  const { status: newStatus, performed_by } = body;

  if (!newStatus) {
    return NextResponse.json({ error: 'status is required' }, { status: 400 });
  }

  // Get current translation
  const existing = await db.execute({
    sql: 'SELECT t.*, tk.tags FROM translations t JOIN translation_keys tk ON t.key_id = tk.id WHERE t.key_id = ? AND t.locale = ?',
    args: [keyId, locale],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
  }

  const currentStatus = existing.rows[0].status as string;
  const tags = JSON.parse(existing.rows[0].tags as string) as string[];

  // Check if transition is valid
  const validTargets = VALID_TRANSITIONS[currentStatus];
  if (!validTargets || !validTargets.includes(newStatus)) {
    return NextResponse.json(
      { error: `Invalid transition: ${currentStatus} → ${newStatus}` },
      { status: 400 }
    );
  }

  // Non-compliance keys cannot enter legal workflow
  const isCompliance = tags.includes('compliance');
  if (!isCompliance && (newStatus === 'legal_review' || newStatus === 'legal_approved')) {
    return NextResponse.json(
      { error: 'Only compliance-tagged keys can enter legal workflow' },
      { status: 400 }
    );
  }

  // Build update
  const updates: string[] = ['status = ?'];
  const args: (string | null)[] = [newStatus];

  if (newStatus === 'approved') {
    updates.push('approved_by = ?');
    args.push(performed_by || 'reviewer');
  }
  if (newStatus === 'legal_approved') {
    updates.push('legal_approved_by = ?');
    args.push(performed_by || 'legal_team');
  }
  // Reset approvals on backward transitions
  if (newStatus === 'draft') {
    updates.push('approved_by = NULL', 'legal_approved_by = NULL');
  }

  updates.push("updated_at = datetime('now')");
  args.push(keyId, locale);

  await db.execute({
    sql: `UPDATE translations SET ${updates.join(', ')} WHERE key_id = ? AND locale = ?`,
    args,
  });

  await logAudit(
    'status_change',
    'translation',
    `${keyId}:${locale}`,
    { status: currentStatus },
    { status: newStatus },
    performed_by || 'admin'
  );

  return NextResponse.json({ key_id: keyId, locale, status: newStatus });
}
