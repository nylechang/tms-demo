# i18n Infrastructure Demo — Specification

## Purpose & Context

A demo project for a Binance i18n Infrastructure Full-Stack Engineer interview. The goal is NOT a production system — it's a small, surgical demo that makes an interviewer immediately recognize: "This person understands the real problems."

**Binance context:** Previously integrated Smartling (third-party TMS), now migrating to an in-house solution. The in-house system is incomplete, PM has a backlog to fill gaps. Three clients (Web, iOS, Android), 40+ locales, multiple product lines, heavy compliance requirements, millions of DAU.

## What This Demo Must Prove

1. i18n is NOT just `t('key')` — it's a **decoupled content pipeline** with compliance governance
2. Separation of **Translation Management (TMS DB)** from **Distribution (versioned static bundles)**
3. Two-dimensional resolution: **Locale × Region** (a Chinese-speaking US user sees zh-TW UI but US-compliant legal text)
4. Versioned bundles, namespace lazy loading, configurable fallback chains, and ICU formatting
5. Key lifecycle, audit trails, and graceful degradation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Backend/API**: Next.js API Routes
- **Database**: SQLite via Turso (`@libsql/client`)
- **Styling**: Tailwind CSS
- **ICU Formatting**: `intl-messageformat` (FormatJS)
- **Deployment**: Vercel
- **Language**: TypeScript throughout

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Admin UI (TMS Lite)                    │
│  Create/Edit keys • Tag compliance • Configure fallback │
│  Review workflow • Publish versions • Audit log viewer   │
└──────────────────────────┬──────────────────────────────┘
                           │ CRUD API
                           ▼
┌─────────────────────────────────────────────────────────┐
│               SQLite (Source of Truth)                   │
│  translations • audit_log • fallback_configs            │
│  namespaces • publish_versions • region_overrides       │
└──────────────────────────┬──────────────────────────────┘
                           │ Publish action
                           ▼
┌─────────────────────────────────────────────────────────┐
│          Published Bundles (Versioned, Immutable)        │
│  Stored in DB, served via API routes                    │
│  (In production: S3 + CloudFront CDN)                   │
└──────────────────────────┬──────────────────────────────┘
                           │ Client fetches
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Client SDK (i18n Loader)                    │
│  Version check via manifest • Namespace lazy loading    │
│  Configurable fallback chain • ICU MessageFormat        │
│  Region override merging • In-memory cache              │
└─────────────────────────────────────────────────────────┘
```

**Key architectural principles:**
1. Management layer (DB + Admin) and distribution layer (static JSON bundles) are completely decoupled. The "Publish" action bridges them — snapshotting DB state into immutable versioned bundles.
2. RTL is a first-class concern. The i18n system carries directionality metadata per locale so clients apply layout changes automatically.

## Core Features (Acceptance Criteria)

### Compliance Workflow
- Translation keys can be tagged `"compliance"` to indicate legal sensitivity
- Compliance-tagged keys require legal sign-off before appearing in published bundles
- Non-compliance keys follow a shorter approval workflow
- A compliance key missing legal approval is excluded per-key (does not block other keys from publishing)
- All mutations are logged to an append-only audit trail

### Locale × Region Resolution
- Users have both a UI locale (language preference) and a regulatory region (e.g., US, EU, MENA)
- Region overrides replace specific translation values based on the user's region
- Example: a zh-Hant speaker in the US sees Chinese UI but US-compliant legal disclaimers
- Compliance-tagged overrides also require legal approval before publishing

### Configurable Fallback Chains
- Each locale has a configurable fallback chain stored in the database (not hardcoded)
- Regional teams control their own fallback preferences
- zh-Hant-TW explicitly excludes zh-Hans from its chain (cultural sensitivity)
- If the entire chain is exhausted, the raw key ID is returned (never empty string)

### Versioned Immutable Bundles
- Publishing creates a new version — bundles are immutable snapshots
- Rollback creates a new version by copying old bundle data (no mutation of history)
- A manifest endpoint serves current version, locale metadata, and fallback chains
- Bundle URLs include version number, enabling `Cache-Control: immutable`

### Namespace Lazy Loading
- Translation keys are organized into namespaces scoped to **feature surfaces** (e.g., common, trade, wallet)
- The SDK loads only the namespaces needed by the current page
- Already-loaded namespaces are cached in memory

### ICU MessageFormat
- Pluralization, select, number formatting — all handled client-side via `intl-messageformat`
- Arabic plural support (6 forms: zero, one, two, few, many, other)
- BiDi-safe interpolation for mixed-direction text (Arabic + English/numbers)

### RTL Support
- Switching to Arabic mirrors the entire page layout
- Directionality is driven by locale metadata from the manifest (not hardcoded locale lists)
- CSS logical properties are used throughout (never manual `[dir="rtl"]` hacks)
- Bidirectional text within Arabic sentences renders correctly (embedded LTR numbers, brand names)

### Audit Trail
- Append-only log of all system actions (create, update, approve, publish, rollback)
- Answers the question: "What did the user see at time T?" for regulatory compliance

## Data Model (Key Tables)

Claude designs the full schema. The system needs these tables with at minimum these key columns:

- **namespaces** — id, description
- **translation_keys** — id, namespace_id, description, tags (JSON array), status (active/deprecated)
- **translations** — key_id, locale, value (ICU string), status (draft→review→approved→legal_review→legal_approved), approved_by, legal_approved_by
- **locale_metadata** — locale, direction (ltr/rtl), display_name (native), english_name, script, enabled
- **fallback_configs** — locale, fallback_chain (JSON array)
- **region_overrides** — key_id, locale, region, value, legal_approved_by
- **audit_log** — action, entity_type, entity_id, old_value, new_value, performed_by, timestamp
- **publish_versions** — version, published_at, published_by, notes, status (active/rolled_back)
- **published_bundles** — version, locale, namespace, bundle_type (base/override), region, content (JSON)

## API Categories

Claude designs specific routes. The system needs these capabilities:

**Admin/TMS APIs:**
- CRUD for translation keys (create, list with filters, get detail, update metadata)
- Create/update translations (upsert per key+locale)
- Status transitions (forward: draft→review→approved→legal_review→legal_approved; backward for rejection)
- Fallback chain configuration (list, update per locale)
- Region override management (CRUD + legal approval)
- Publish action (validate → bundle → store)
- Version listing and rollback
- Audit log querying with filters

**Client-facing APIs:**
- Manifest endpoint (current version, locale metadata, fallback chains, available namespaces)
- Bundle fetching by version/locale/namespace (base bundles and region override bundles)

## Admin UI Pages

1. **Translation Dashboard** — Table of all keys with filters (namespace, tags, status). Add Key action (namespace dropdown populated dynamically). Compliance keys visually prominent.
2. **Key Detail & Translation Editor** — All locales for a key, inline editing, forward and backward status workflow buttons per compliance-model.md transitions. Region overrides section with full CRUD (create, edit, delete) and legal approval controls. Visual enforcement of legal gates on compliance keys.
3. **Fallback Chain Configuration** — All locales with their chains, editable. Visual preview of resolution order.
4. **Publish & Version History** — Publish flow is two steps: (1) dry-run shows validation report (ready count, excluded compliance keys, ICU errors); (2) confirm triggers actual publish. Version history table with rollback buttons.
5. **Audit Log** — Chronological log, filterable by action type, user (performed_by), date range (from/to), entity.

## Demo Pages (Consumer-facing)

1. **Trade Interface** (`/demo/trade`) — Static translations, ICU interpolation, live plural counter (with Arabic 6-form showcase), locale-sensitive number formatting, locale switcher, region selector. 
2. **Wallet Interface** (`/demo/wallet`) — Lazy-loads wallet namespace on navigation, shows that common namespace was already cached. Region-varying compliance disclaimers. Earn/Rewards section demonstrates region-driven label substitution.
3. **RTL Demonstration** — Switching to Arabic mirrors entire layout. Bidirectional text with embedded numbers/currency renders correctly. Smooth visual transition between LTR/RTL.

## Out of Scope

- Real CDN/S3 deployment (bundles served from DB)
- Authentication/authorization (use mock users)
- AST extraction CI pipeline
- WebSocket/SSE real-time updates
- Translation Memory / machine translation
- Mobile SDKs
- Delta/incremental sync
- localStorage offline fallback

## Milestones

1. **Foundation** — Database setup, schema, seed data, basic CRUD APIs, publish pipeline
2. **Client SDK** — i18n loader, manifest check, namespace lazy loading, fallback resolution, ICU integration, React provider + hooks, region override merging
3. **Admin UI** — Dashboard, key editor, fallback config, publish page, audit log
4. **Demo Pages** — Trade page, wallet page, locale switcher, region toggle, RTL showcase
5. **Polish** — README, ARCHITECTURE.md, consistent styling, error handling, Vercel deploy
