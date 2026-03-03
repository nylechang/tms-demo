# Compliance Model — Reference

This document describes the full compliance enforcement logic. Read this when implementing the compliance workflow, status transitions, publish pipeline, and region override approval.

## Core Rule

Any translation key tagged with `"compliance"` (via `json_each(tags)`) requires legal sign-off before it can appear in a published bundle.

## Status Workflow

### Translations table

Full status lifecycle: `draft → review → approved → legal_review → legal_approved`

**Valid forward transitions:**
- `draft → review` (submit for review)
- `review → approved` (reviewer approves)
- `approved → legal_review` (compliance keys only — submit to legal)
- `legal_review → legal_approved` (legal clears)

**Valid backward transitions (rejection/rework):**
- `review → draft` (reviewer sends back)
- `approved → draft` (re-open for editing)
- `legal_review → approved` (legal sends back to translation team)

**Invalid transitions return 400 with explanation.** For example, `draft → legal_approved` skips steps.

**Non-compliance keys:** The API must reject transitions to `legal_review` or `legal_approved`. Only keys with a `'compliance'` tag can enter the legal workflow.

**The `review` status has no significance in the publish pipeline.** The pipeline checks for `status IN ('approved', 'legal_approved')`. Keys in `review` are excluded.

### Region overrides table

No status workflow. Overrides are simpler — they are either legally cleared or not.

- `legal_approved_by IS NOT NULL` → cleared
- `legal_approved_by IS NULL` → not cleared
- Editing an override's value resets `legal_approved_by` to `NULL` (requires re-approval)
- All mutations (create, edit, approve, delete) are logged to `audit_log`

## Publish Pipeline Enforcement

### For translations:
```
For each translation where status IN ('approved', 'legal_approved'):
  Does its key have a 'compliance' tag? (use json_each, NOT LIKE)
    YES → Is legal_approved_by non-null?
      YES → Include in bundle ✓
      NO  → EXCLUDE this key, log warning ✗ (does NOT block other keys)
    NO  → Include in bundle ✓
  Is the ICU syntax valid? (parse with intl-messageformat)
    YES → Continue ✓
    NO  → EXCLUDE, log error ✗
```

### For region overrides:
```
For each region_override:
  Does its key have a 'compliance' tag? (use json_each)
    YES → Is region_override.legal_approved_by non-null?
      YES → Include in override bundle ✓
      NO  → EXCLUDE this override, log warning ✗
    NO  → Include in override bundle ✓
```

## Non-compliance Keys

Non-compliance keys (without a `"compliance"` tag) follow a shorter workflow: `draft → review → approved`. They are included in the publish if `status IN ('approved', 'legal_approved')`. The `legal_approved_by` field is irrelevant for these keys.

## Key Principle: Exclusion is Per-Key, Not Per-Publish

A compliance key missing legal approval is excluded from the bundle with a logged warning, but it does NOT block the entire publish. Other keys still ship. The pre-publish validation report surfaces these exclusions as warnings, giving the publisher visibility.

## Upsert Reset Behavior

When a translation is updated (via `INSERT ... ON CONFLICT(key_id, locale) DO UPDATE`), these columns reset:
- `value` → new text
- `status` → `'draft'`
- `approved_by` → `NULL`
- `legal_approved_by` → `NULL`
- `updated_at` → current timestamp

This is intentional: any textual change to an approved translation must be re-reviewed. Currently published bundles are unaffected (immutable snapshots). The pre-publish validation report will show reduced key counts if previously approved translations are now in draft.

## Production Consideration: Carry-Forward

In production, the pipeline could optionally carry forward the last-published value for any key whose working copy has regressed to `draft`, preventing coverage gaps between edits and re-approval. For the demo, the pre-publish validation report surfacing this as a visible warning is sufficient.
