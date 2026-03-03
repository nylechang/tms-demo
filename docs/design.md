# design.md

Design is not the focus of this project. These notes exist to prevent default "AI-generated" aesthetics and keep the two surfaces coherent with their context. Make reasonable decisions and move on.

---

## Admin UI

**Audience:** Translators, PMs, engineers, legal reviewers. Long working sessions.

**Reference:** Linear × Apple — internal tool, not consumer product. Dense but intentional. Every element earns its place.

**Polarity:** Light background. Positive polarity offers superior legibility for high-density data interfaces used for prolonged periods.

**Layout:** Floating card — sidebar and content area sit on a slightly recessed app background, creating a clear boundary between navigation and active task. Fixed sidebar + topbar + scrollable content + statusbar.

**Typography:** Monospace for keys, values, IDs, and status labels. Clean sans-serif for prose and UI chrome. Avoid Inter.

**Radius and spacing:** Layered — outer containers more rounded, inner elements progressively tighter. Apple-style nesting, not flat uniformity.

**Information hierarchy:** Use typographic weight and color contrast to layer information within rows — not separate columns per attribute. Primary identifiers scan first; secondary context recedes.

**Status system:** Fewer hues are better. The success/neutral state should visually recede — only actionable states compete for attention. Never rely on color alone — always pair with a label.

**Compliance keys:** Governance is orthogonal to workflow status — signal it through a separate visual channel (icon, not color). Use a hue outside the status palette. Quiet in list view, expanded in detail view.

**Accessibility:** WCAG AA minimum on all text.

---

## Demo Pages

**Audience:** End users of a crypto trading platform.

These pages demonstrate the i18n SDK — RTL layout, locale switching, region overrides, ICU formatting. They are not original design work.

**Reference:** Binance Web UI. Mirror it closely enough that an interviewer immediately recognizes the context. Dark theme, dense data tables, monospace numbers, familiar trading interface conventions.

**RTL:** Arabic locale must mirror the full layout. Use CSS logical properties throughout — never hardcoded left/right values.

Do not spend creative effort here. Functional fidelity to the Binance reference matters more than originality.
