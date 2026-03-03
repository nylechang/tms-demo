import { getDb } from './db';
import IntlMessageFormat from 'intl-messageformat';

interface PublishWarning {
  type: 'compliance_excluded' | 'icu_invalid' | 'arabic_plural_incomplete';
  key: string;
  locale: string;
  detail: string;
}

interface PublishReport {
  version: number;
  includedKeys: number;
  excludedKeys: number;
  warnings: PublishWarning[];
  overrideBundles: number;
}

// Validate ICU syntax by attempting to parse
function validateICU(value: string, locale: string): string | null {
  try {
    new IntlMessageFormat(value, locale);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

// Check if Arabic plural has all 6 categories
const ARABIC_PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'];

function checkArabicPlurals(value: string): string[] {
  if (!value.includes('plural')) return [];
  const missing = ARABIC_PLURAL_CATEGORIES.filter(
    cat => !value.includes(cat) && !value.includes(`=${cat === 'zero' ? '0' : ''}`)
  );
  // '=0' counts as 'zero'
  const adjustedMissing = missing.filter(cat => {
    if (cat === 'zero' && value.includes('=0')) return false;
    return true;
  });
  return adjustedMissing;
}

export async function publish(publishedBy: string, notes?: string, dryRun = false): Promise<PublishReport> {
  const db = getDb();
  const warnings: PublishWarning[] = [];
  let includedKeys = 0;
  let excludedKeys = 0;
  let overrideBundleCount = 0;

  // Get next version number
  const versionResult = await db.execute(
    'SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM publish_versions'
  );
  const version = Number(versionResult.rows[0].next_version);

  // Get all enabled locales
  const locales = await db.execute(
    'SELECT locale, direction, display_name, english_name, script FROM locale_metadata WHERE enabled = 1'
  );

  // Get all namespaces
  const namespaces = await db.execute('SELECT id FROM namespaces');

  // Get all fallback configs
  const fallbacks = await db.execute('SELECT locale, fallback_chain FROM fallback_configs');

  // Build the transaction statements
  const stmts: { sql: string; args: (string | number | null)[] }[] = [];

  // 1. Create version
  stmts.push({
    sql: 'INSERT INTO publish_versions (version, published_by, notes) VALUES (?, ?, ?)',
    args: [version, publishedBy, notes || null],
  });

  // Track which namespaces each locale has bundles for
  const localeNamespaces: Record<string, string[]> = {};

  // 2. Build base bundles for each locale × namespace
  for (const localeRow of locales.rows) {
    const locale = localeRow.locale as string;
    localeNamespaces[locale] = [];

    for (const nsRow of namespaces.rows) {
      const ns = nsRow.id as string;

      // Query approved translations for this locale+namespace
      // Check compliance via json_each
      const translations = await db.execute({
        sql: `SELECT
                tk.id as key_id,
                t.value,
                t.status,
                t.legal_approved_by,
                EXISTS(
                  SELECT 1 FROM json_each(tk.tags) WHERE json_each.value = 'compliance'
                ) as is_compliance
              FROM translations t
              JOIN translation_keys tk ON t.key_id = tk.id
              WHERE tk.namespace_id = ?
                AND t.locale = ?
                AND t.status IN ('approved', 'legal_approved')
                AND tk.status = 'active'`,
        args: [ns, locale],
      });

      const bundle: Record<string, string> = {};

      for (const row of translations.rows) {
        const keyId = row.key_id as string;
        const value = row.value as string;
        const isCompliance = Number(row.is_compliance) === 1;
        const legalApprovedBy = row.legal_approved_by as string | null;

        // Compliance check
        if (isCompliance && !legalApprovedBy) {
          warnings.push({
            type: 'compliance_excluded',
            key: keyId,
            locale,
            detail: 'Compliance key missing legal approval',
          });
          excludedKeys++;
          continue;
        }

        // ICU validation
        const icuError = validateICU(value, locale);
        if (icuError) {
          warnings.push({
            type: 'icu_invalid',
            key: keyId,
            locale,
            detail: icuError,
          });
          excludedKeys++;
          continue;
        }

        // Arabic plural completeness warning (warn, don't block)
        if (locale.startsWith('ar') && value.includes('plural')) {
          const missingCategories = checkArabicPlurals(value);
          if (missingCategories.length > 0) {
            warnings.push({
              type: 'arabic_plural_incomplete',
              key: keyId,
              locale,
              detail: `Missing plural categories: ${missingCategories.join(', ')}`,
            });
          }
        }

        // Strip namespace prefix for bundle key (e.g. "common:nav.home" → "nav.home")
        const bundleKey = keyId.split(':').slice(1).join(':');
        bundle[bundleKey] = value;
        includedKeys++;
      }

      // Only insert if bundle has content
      if (Object.keys(bundle).length > 0) {
        localeNamespaces[locale].push(ns);
        stmts.push({
          sql: `INSERT INTO published_bundles (version, locale, namespace, bundle_type, region, content)
                VALUES (?, ?, ?, 'base', '', ?)`,
          args: [version, locale, ns, JSON.stringify(bundle)],
        });
      }
    }
  }

  // 3. Build override bundles
  const overrides = await db.execute({
    sql: `SELECT
            ro.key_id,
            ro.locale,
            ro.region,
            ro.value,
            ro.legal_approved_by,
            tk.namespace_id,
            EXISTS(
              SELECT 1 FROM json_each(tk.tags) WHERE json_each.value = 'compliance'
            ) as is_compliance
          FROM region_overrides ro
          JOIN translation_keys tk ON ro.key_id = tk.id
          WHERE tk.status = 'active'`,
    args: [],
  });

  // Group overrides by (locale, namespace, region)
  const overrideBundles: Record<string, Record<string, string>> = {};

  for (const row of overrides.rows) {
    const keyId = row.key_id as string;
    const locale = row.locale as string;
    const region = row.region as string;
    const value = row.value as string;
    const nsId = row.namespace_id as string;
    const isCompliance = Number(row.is_compliance) === 1;
    const legalApprovedBy = row.legal_approved_by as string | null;

    // Compliance check for overrides
    if (isCompliance && !legalApprovedBy) {
      warnings.push({
        type: 'compliance_excluded',
        key: keyId,
        locale: `${locale}/${region}`,
        detail: 'Compliance override missing legal approval',
      });
      continue;
    }

    // ICU validation
    const icuError = validateICU(value, locale);
    if (icuError) {
      warnings.push({
        type: 'icu_invalid',
        key: keyId,
        locale: `${locale}/${region}`,
        detail: icuError,
      });
      continue;
    }

    const bundleKey = `${locale}|${nsId}|${region}`;
    if (!overrideBundles[bundleKey]) {
      overrideBundles[bundleKey] = {};
    }
    const shortKey = keyId.split(':').slice(1).join(':');
    overrideBundles[bundleKey][shortKey] = value;
  }

  for (const [bundleKey, bundle] of Object.entries(overrideBundles)) {
    const [locale, ns, region] = bundleKey.split('|');
    stmts.push({
      sql: `INSERT INTO published_bundles (version, locale, namespace, bundle_type, region, content)
            VALUES (?, ?, ?, 'override', ?, ?)`,
      args: [version, locale, ns, region, JSON.stringify(bundle)],
    });
    overrideBundleCount++;
  }

  // 4. Generate manifest (version-agnostic content)
  const localeMetadata: Record<string, {
    direction: string;
    display_name: string;
    english_name: string;
    script: string;
  }> = {};

  for (const row of locales.rows) {
    localeMetadata[row.locale as string] = {
      direction: row.direction as string,
      display_name: row.display_name as string,
      english_name: row.english_name as string,
      script: row.script as string,
    };
  }

  const fallbackChains: Record<string, string[]> = {};
  for (const row of fallbacks.rows) {
    fallbackChains[row.locale as string] = JSON.parse(row.fallback_chain as string);
  }

  const namespaceList = namespaces.rows.map(r => r.id as string);

  const manifestContent = {
    locales: Object.fromEntries(
      Object.entries(localeMetadata).map(([locale, meta]) => [
        locale,
        {
          ...meta,
          namespaces: localeNamespaces[locale] || [],
          fallback_chain: fallbackChains[locale] ?? ['en'],
        },
      ])
    ),
    namespaces: namespaceList,
    default_locale: 'en',
  };

  // Ensure en has empty fallback chain
  if (manifestContent.locales['en']) {
    manifestContent.locales['en'].fallback_chain = [];
  }

  stmts.push({
    sql: `INSERT INTO published_bundles (version, locale, namespace, bundle_type, region, content)
          VALUES (?, '_manifest', '_manifest', 'base', '', ?)`,
    args: [version, JSON.stringify(manifestContent)],
  });

  // In dry-run mode, return the report without writing anything
  if (dryRun) {
    return {
      version,
      includedKeys,
      excludedKeys,
      warnings,
      overrideBundles: overrideBundleCount,
    };
  }

  // Execute all in a single transaction
  await db.batch(stmts, 'write');

  // Log to audit
  await db.execute({
    sql: `INSERT INTO audit_log (action, entity_type, entity_id, old_value, new_value, performed_by)
          VALUES ('publish', 'version', ?, NULL, ?, ?)`,
    args: [
      String(version),
      JSON.stringify({ includedKeys, excludedKeys, warnings: warnings.length }),
      publishedBy,
    ],
  });

  return {
    version,
    includedKeys,
    excludedKeys,
    warnings,
    overrideBundles: overrideBundleCount,
  };
}

export async function rollback(targetVersion: number, performedBy: string): Promise<number> {
  const db = getDb();

  // Verify target version exists and is active
  const target = await db.execute({
    sql: 'SELECT version, status FROM publish_versions WHERE version = ?',
    args: [targetVersion],
  });
  if (target.rows.length === 0) {
    throw new Error(`Version ${targetVersion} not found`);
  }
  if (target.rows[0].status === 'rolled_back') {
    throw new Error(`Version ${targetVersion} is already rolled back`);
  }

  // Get next version
  const versionResult = await db.execute(
    'SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM publish_versions'
  );
  const newVersion = Number(versionResult.rows[0].next_version);

  // Get current active version to mark as rolled back
  const currentActive = await db.execute(
    "SELECT version FROM publish_versions WHERE status = 'active' ORDER BY version DESC LIMIT 1"
  );

  const stmts: { sql: string; args: (string | number | null)[] }[] = [];

  // Create new version
  stmts.push({
    sql: 'INSERT INTO publish_versions (version, published_by, notes, status) VALUES (?, ?, ?, ?)',
    args: [newVersion, performedBy, `Rollback to version ${targetVersion}`, 'active'],
  });

  // Copy all bundles from target version to new version
  stmts.push({
    sql: `INSERT INTO published_bundles (version, locale, namespace, bundle_type, region, content)
          SELECT ?, locale, namespace, bundle_type, region, content
          FROM published_bundles WHERE version = ?`,
    args: [newVersion, targetVersion],
  });

  // Mark current active version as rolled_back
  if (currentActive.rows.length > 0) {
    const currentVersion = Number(currentActive.rows[0].version);
    if (currentVersion !== targetVersion) {
      stmts.push({
        sql: "UPDATE publish_versions SET status = 'rolled_back' WHERE version = ?",
        args: [currentVersion],
      });
    }
  }

  await db.batch(stmts, 'write');

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (action, entity_type, entity_id, old_value, new_value, performed_by)
          VALUES ('rollback', 'version', ?, ?, ?, ?)`,
    args: [
      String(newVersion),
      JSON.stringify({ rolled_back_from: currentActive.rows[0]?.version }),
      JSON.stringify({ restored_from: targetVersion }),
      performedBy,
    ],
  });

  return newVersion;
}
