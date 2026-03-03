import { getDb } from './db';

export async function logAudit(
  action: string,
  entityType: string,
  entityId: string,
  oldValue: unknown,
  newValue: unknown,
  performedBy: string
) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO audit_log (action, entity_type, entity_id, old_value, new_value, performed_by)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      action,
      entityType,
      entityId,
      oldValue ? JSON.stringify(oldValue) : null,
      newValue ? JSON.stringify(newValue) : null,
      performedBy,
    ],
  });
}
