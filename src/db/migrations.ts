import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@libsql/client';

// Split SQL into statements, respecting string literals
function splitSQL(sql: string): string[] {
  const stmts: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];

    if (inString) {
      current += ch;
      // Check for escaped quote (doubled)
      if (ch === stringChar) {
        if (i + 1 < sql.length && sql[i + 1] === stringChar) {
          current += sql[i + 1];
          i++;
        } else {
          inString = false;
        }
      }
    } else if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      current += ch;
    } else if (ch === '-' && i + 1 < sql.length && sql[i + 1] === '-') {
      // Skip line comments
      const newline = sql.indexOf('\n', i);
      if (newline === -1) break;
      i = newline;
    } else if (ch === ';') {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        stmts.push(trimmed);
      }
      current = '';
    } else {
      current += ch;
    }
  }

  const trimmed = current.trim();
  if (trimmed.length > 0) {
    stmts.push(trimmed);
  }

  return stmts;
}

async function migrate() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Running schema...');
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  const schemaStmts = splitSQL(schema);
  for (const stmt of schemaStmts) {
    await db.execute(stmt);
  }
  console.log(`  Executed ${schemaStmts.length} schema statements`);

  console.log('Running seed data...');
  const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
  const seedStmts = splitSQL(seed);
  for (const stmt of seedStmts) {
    try {
      await db.execute(stmt);
    } catch (e) {
      console.error('Failed statement:', stmt.substring(0, 100));
      throw e;
    }
  }
  console.log(`  Executed ${seedStmts.length} seed statements`);

  console.log('Running initial publish...');
  const { publish } = await import('../lib/publish');
  const report = await publish('system', 'Initial publish from seed data');

  console.log(`Published version ${report.version}:`);
  console.log(`  Included keys: ${report.includedKeys}`);
  console.log(`  Excluded keys: ${report.excludedKeys}`);
  console.log(`  Override bundles: ${report.overrideBundles}`);
  if (report.warnings.length > 0) {
    console.log('  Warnings:');
    for (const w of report.warnings) {
      console.log(`    [${w.type}] ${w.key} (${w.locale}): ${w.detail}`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
