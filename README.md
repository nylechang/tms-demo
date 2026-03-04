# i18n Infrastructure Demo

**i18n is a content pipeline, not a string replacement library.** This demo shows what that means in practice — for a financial platform with 40+ locales, compliance requirements, and users across multiple legal jurisdictions.

[Live Demo](https://tms-demo-amber.vercel.app/) · [3-min walkthrough video](#)

---

## Why it matters

A regulator asks: *"What legal text did your US users see last Tuesday at 4pm?"*

Most i18n systems can't answer that. This one can.

---

## How it works

**Translators manage content in the TMS.** Compliance-tagged keys require legal sign-off before they can ship.

**Publishing snapshots approved content into a versioned, immutable bundle.** The bundle URL includes the version number — so clients can cache forever and there's no CDN invalidation problem.

**The client SDK fetches only what the current page needs.** It checks the manifest for version drift, lazy-loads namespaces, merges region overrides, and resolves fallback chains — all configured in the database, not hardcoded.

---

## The decisions that make it work

**No approval, no ship — and the system won't let you forget.**
Compliance keys are blocked from publishing until legal signs off. One unapproved key doesn't block the whole publish — it's excluded per-key, with a warning in the validation report.

**Any edit resets approval.**
If a translator changes a compliance string, its status drops back to `draft` and legal has to re-approve. Already-published bundles are unaffected — they're immutable snapshots.

**Language ≠ legal jurisdiction.**
A US-KYC user with a Chinese UI sees US-compliant legal text. `locale` controls the language. `region` controls the legal content. They're separate dimensions in the schema — not frontend logic.

**Rollback doesn't erase anything.**
It duplicates old bundle rows into a new version number. Every version stays on record as-is.

**Fallback chains are configurable, not hardcoded.**
`zh-TW` explicitly excludes `zh-Hans` from its chain. That's a product decision — no code changes needed.

**Arabic needs more than a mirrored layout.**
Strings like `"سعر BTC: $42,000"` break bidirectional rendering if you concatenate manually. All dynamic content goes through ICU MessageFormat, which handles Unicode directional isolation automatically. The publish pipeline also warns if an Arabic translation is missing any of the six plural categories.

---

## What's simplified in the demo

- **Bundles are stored in the DB**, not S3. In production: S3 + CloudFront, same architecture.
- **No real auth.** Users are mocked (`translator`, `legal_team`, `engineer`).
- **Region is manually toggled.** In production: derived from KYC data.
- **No delta sync.** In production: clients send a version hash, receive only changed keys.

---

## Stack

Next.js 14 App Router · TypeScript · Turso (SQLite) · Tailwind CSS · `intl-messageformat` · Vercel

---

## Run locally

```bash
npm install
turso dev --db-file local.db
npm run dev
```

Migrations and seed data run automatically on first start, including an initial publish that generates version 1.
