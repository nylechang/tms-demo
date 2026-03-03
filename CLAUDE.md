# CLAUDE.md

## Working Style
This is a demo project for a job interview. It must be correct and explainable,
not production-grade. Prioritize readability over abstraction.

- Only implement what is asked for in the current prompt. Do not build ahead.
- Each phase must produce a working, testable state.
- Keep architecture simple — each component should be readable on its own.
- When in doubt whether to add something, don't. Fewer files I can explain
  in an interview > more files I can't.
- Prefer flat, obvious code over clever abstractions.
- Do not create files unless they serve a clear purpose.

## Project
i18n infrastructure demo — Next.js 14+ App Router, TypeScript, Turso (SQLite), Tailwind CSS, Vercel deployment.

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint check
- `turso dev` — local SQLite for development (zero cloud dependency)

## Reference Docs (read when reaching each phase)
- `docs/seed-data.md` — exact translations, locale coverage requirements, seed data rules
- `docs/compliance-model.md` — full compliance workflow, status transitions, pipeline enforcement logic
- `docs/design.md` — visual design principles, read before writing any UI code

---

## Database

**Use Turso (`@libsql/client`), NEVER `better-sqlite3`.** better-sqlite3 is a native Node.js addon — incompatible with Vercel serverless (ephemeral, read-only FS) and Edge Runtime. Turso is hosted SQLite with a pure JS client. SQL dialect is identical. For local dev, `turso dev` runs an embedded SQLite file.

**Bundles must be stored in the `published_bundles` DB table, NOT the filesystem.** Vercel serverless functions have no persistent filesystem — writes to `/public/` fail at runtime. DB storage is atomic (version + all bundles committed in one transaction). In production this would be S3; for the demo, DB storage is functionally identical.

**`published_bundles.region` must be `NOT NULL DEFAULT ''`, not nullable.** SQLite treats NULLs as distinct in UNIQUE constraints — `(v1, 'en', 'trade', 'base', NULL)` could be inserted twice without error. Use empty string for base bundles.

**Manifest stored version-agnostic.** The manifest row in `published_bundles` (locale='_manifest', namespace='_manifest') must NOT contain `version` or `timestamp` fields. The `/api/i18n/manifest` endpoint injects these dynamically from `publish_versions`. This keeps manifest content version-agnostic — rollback copies rows without JSON rewriting.

**`translations` table is the mutable working copy; `audit_log` is the immutable history.** When a translation is edited: (1) snapshot old row into audit_log, (2) UPDATE the translations row. Historical queries go to audit_log, not translations.

---

## Compliance

**Always use `json_each(tk.tags)` to check for `'compliance'` tag membership. NEVER use `LIKE '%compliance%'`** — that matches `'non_compliance'` or `'compliance_v2'`.

**Namespaces are distribution boundaries, not governance boundaries.** Do not create a `compliance` namespace — compliance-tagged keys live in their feature namespace (e.g., `trade`, `wallet`).

**Upsert MUST reset status and approvals.** When a translation is updated via `INSERT ... ON CONFLICT(key_id, locale) DO UPDATE`, reset: `status → 'draft'`, `approved_by → NULL`, `legal_approved_by → NULL`. Any textual change to an approved translation requires re-review. Currently published bundles are unaffected (immutable snapshots).

**Region override edits also reset `legal_approved_by` to NULL** for compliance-tagged keys. Same principle — textual change requires re-approval.

**Exclusion is per-key, not per-publish.** A compliance key missing legal approval is excluded from the bundle with a logged warning. It does NOT block other keys from publishing.

**Non-compliance keys cannot enter legal workflow.** The status transition API must reject transitions to `legal_review` or `legal_approved` for keys without a `'compliance'` tag.

**See `docs/compliance-model.md` for full status workflow, enforcement rules per table, and pipeline logic.**

---

## Client SDK

**ICU MessageFormat for ALL dynamic content — NEVER manual string concatenation.** When Arabic text contains embedded LTR segments (English brand names, numbers, currency), raw concatenation (`"سعر " + "BTC" + " هو " + price`) breaks bidirectional rendering. ICU inserts Unicode directional isolation marks (U+2066 LRI, U+2069 PDI) automatically.

**Fallback: if the entire chain is exhausted, return the raw key ID (e.g., `trade:order.confirm_btn`). Never return empty string.**

**Arabic has 6 plural forms** (zero, one, two, few, many, other), not the 2 English uses (one, other). When saving or publishing Arabic translations containing `{count, plural, ...}`, validate that all six categories are present. Missing categories cause grammatically incorrect Arabic. The publish pipeline should warn (not block) on missing Arabic plural categories.

**Locale detection priority:** URL param → Cookie → Accept-Language header → default 'en'. Initial detection runs in `middleware.ts` (server-side, has access to Accept-Language). Locale switching is client-side (update cookie + React state, no server roundtrip).

**Namespace lazy loading must be visible in the demo.** Log to console when namespaces load and when cache hits occur. Show subtle loading indicators in the UI.

**Region override merging:** After loading base bundles, fetch override bundles for the user's region. Override keys win on conflict. If override bundle returns 404, silently continue with base translations.

---

## RTL / BiDi

**RTL is driven by locale metadata from the manifest `dir` field, NOT hardcoded locale lists.** Never write `if (locale.startsWith('ar')) dir = 'rtl'` — this breaks when adding Urdu, Farsi, or future RTL locales. The SDK reads direction from the manifest and sets `document.documentElement.dir` and `document.documentElement.lang`.

**Use CSS logical properties throughout.** `margin-inline-start` not `margin-left`, `padding-inline-end` not `padding-right`. Tailwind: `ms-*`, `me-*`, `ps-*`, `pe-*`. Never use `[dir="rtl"] .some-class` hacks.

**BiDi edge case in financial platforms:** Price strings like `"سعر BTC: $42,000"` can reorder unexpectedly. Always use ICU MessageFormat placeholders — never manual concatenation. Include at least one demo example with Arabic text containing embedded numbers and currency.

---

## Distribution / Versioning

**Rollback = copy rows to new version, NEVER mutate history.** Rollback creates a NEW version by copying `published_bundles` rows from the target version (including the manifest row). Since manifest content is version-agnostic, no JSON rewriting needed. Mark the bad version as 'rolled_back'. Entire rollback operation must be a single transaction.

**Publish pipeline must execute steps (version creation, bundle insertion, manifest generation) in a single transaction.** If any step fails, roll back entirely — no partial versions.

**Manifest includes ALL enabled locales from `locale_metadata`**, even those with no direct bundles in `published_bundles`. Their `namespaces` array may be empty — the SDK uses `fallback_chain` to load from parent locales.

**Locales without explicit fallback_configs entries default to `["en"]` as their fallback chain.** Exception: `en` itself has an explicit empty chain `[]` — do NOT return `["en"]` for English.

---

## Deployment

**Turso + `@libsql/client` is a pure JS client — API routes work in both Node.js and Edge Runtime.** No need for `export const runtime = 'nodejs'` unless importing native modules for other reasons.

**`seed.sql` inserts data only. `migrations.ts` runs: (1) schema.sql, (2) seed.sql, (3) programmatically calls the publish pipeline** to generate version 1. This ensures ICU validation runs on seed data.
