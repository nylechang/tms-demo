-- Namespaces: feature-scoped groupings for translation keys
CREATE TABLE IF NOT EXISTS namespaces (
  id TEXT PRIMARY KEY,
  description TEXT
);

-- Translation keys: the "what" being translated
CREATE TABLE IF NOT EXISTS translation_keys (
  id TEXT PRIMARY KEY,
  namespace_id TEXT NOT NULL REFERENCES namespaces(id),
  description TEXT,
  tags TEXT NOT NULL DEFAULT '[]',  -- JSON array, e.g. ["compliance"]
  status TEXT NOT NULL DEFAULT 'active',  -- active | deprecated
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Translations: the actual translated strings (mutable working copy)
CREATE TABLE IF NOT EXISTS translations (
  key_id TEXT NOT NULL REFERENCES translation_keys(id),
  locale TEXT NOT NULL,
  value TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',  -- draft | review | approved | legal_review | legal_approved
  approved_by TEXT,
  legal_approved_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (key_id, locale)
);

-- Locale metadata: display info and directionality
CREATE TABLE IF NOT EXISTS locale_metadata (
  locale TEXT PRIMARY KEY,
  direction TEXT NOT NULL DEFAULT 'ltr',  -- ltr | rtl
  display_name TEXT NOT NULL,
  english_name TEXT NOT NULL,
  script TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1
);

-- Fallback chains: configurable per-locale resolution order
CREATE TABLE IF NOT EXISTS fallback_configs (
  locale TEXT PRIMARY KEY,
  fallback_chain TEXT NOT NULL DEFAULT '["en"]'  -- JSON array of locale codes
);

-- Region overrides: locale × region specific translations
CREATE TABLE IF NOT EXISTS region_overrides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_id TEXT NOT NULL REFERENCES translation_keys(id),
  locale TEXT NOT NULL,
  region TEXT NOT NULL,
  value TEXT NOT NULL,
  legal_approved_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(key_id, locale, region)
);

-- Audit log: append-only history of all mutations
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_value TEXT,  -- JSON
  new_value TEXT,  -- JSON
  performed_by TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Publish versions: version metadata
CREATE TABLE IF NOT EXISTS publish_versions (
  version INTEGER PRIMARY KEY,
  published_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_by TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active'  -- active | rolled_back
);

-- Published bundles: immutable versioned snapshots
CREATE TABLE IF NOT EXISTS published_bundles (
  version INTEGER NOT NULL REFERENCES publish_versions(version),
  locale TEXT NOT NULL,
  namespace TEXT NOT NULL,
  bundle_type TEXT NOT NULL DEFAULT 'base',  -- base | override
  region TEXT NOT NULL DEFAULT '',  -- empty string for base bundles
  content TEXT NOT NULL,  -- JSON
  PRIMARY KEY (version, locale, namespace, bundle_type, region)
);
