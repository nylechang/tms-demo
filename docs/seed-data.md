# Seed Data — Reference

Read this when implementing database seeding. Pre-populate with realistic translations to make the demo feel substantial.

## Locales (14 in locale_metadata)

| Locale | Direction | Display Name | Script | Notes |
|---|---|---|---|---|
| en | ltr | English | Latn | Base language, 100% coverage |
| zh-Hant | ltr | 繁體中文 | Hant | High coverage |
| zh-Hant-TW | ltr | 繁體中文（台灣） | Hant | Partial — demonstrates fallback to zh-Hant |
| zh-Hant-HK | ltr | 繁體中文（香港） | Hant | Partial |
| zh-Hans | ltr | 简体中文 | Hans | High coverage |
| zh-Hans-CN | ltr | 简体中文（中国） | Hans | No direct translations — exists only in metadata + fallback config to demonstrate fallback working end-to-end |
| ar | rtl | العربية | Arab | High coverage, RTL layout, critical MENA market |
| ar-SA | rtl | العربية (السعودية) | Arab | Partial — shows regional Arabic fallback to generic ar |
| ar-EG | rtl | العربية (مصر) | Arab | Partial |
| ko | ltr | 한국어 | Kore | Partial — shows fallback to en |
| ja | ltr | 日本語 | Jpan | Partial |
| es | ltr | Español | Latn | Partial |
| es-LA | ltr | Español (Latinoamérica) | Latn | No direct translations — demonstrates fallback via es → en |
| de | ltr | Deutsch | Latn | Minimal (common namespace only) — shows extensive fallback, also demonstrates German text length (~30% longer than English) |

**Key demo point:** Locales like `zh-Hans-CN` and `es-LA` with zero direct translations demonstrate that a brand-new locale is immediately usable via fallback chains.

## Fallback Chains

```
en         → []                              (base language, no fallback)
zh-Hant-TW → ["zh-Hant", "zh-Hant-HK", "en"]  (NEVER zh-Hans)
zh-Hant-HK → ["zh-Hant", "en"]
zh-Hans-CN → ["zh-Hans", "en"]
ar         → ["en"]
ar-SA      → ["ar", "en"]
ar-EG      → ["ar", "en"]
ko         → ["en"]
ja         → ["en"]
es-LA      → ["es", "en"]
de         → ["en"]
```

Default for locales without explicit entry: `["en"]`. Exception: `en` has explicit empty chain.

**Cultural insight for interview:** "A Taiwanese user seeing Simplified Chinese is culturally offensive — they'd rather see English. Arabic regional dialects (Saudi vs Egyptian) are more tolerant — users generally accept Modern Standard Arabic as fallback. These are product/cultural decisions stored as data, not engineering assumptions in code."

## Translation Keys by Namespace

### Namespace: `common` (shared UI)
```
common:nav.home          "Home" / "首頁" / "الرئيسية" / "ホーム" / ...
common:nav.trade         "Trade" / "交易" / "تداول" / ...
common:nav.wallet        "Wallet" / "錢包" / "المحفظة" / ...
common:btn.confirm       "Confirm" / "確認" / "تأكيد" / ...
common:btn.cancel        "Cancel" / "取消" / "إلغاء" / ...
common:btn.next          "Next" / "下一步" / "التالي" / ...
common:btn.submit        "Submit" / "提交" / "إرسال" / ...
common:error.network     "Network error. Please try again." / "網路錯誤，請重試。" / "خطأ في الشبكة. يرجى المحاولة مرة أخرى."
common:error.generic     "Something went wrong." / "發生錯誤。" / "حدث خطأ ما."
common:inbox.count       "You have {count, plural, =0 {no messages} one {# message} other {# messages}}"
                         / "您有 {count, plural, other {# 則訊息}}"
                         / "لديك {count, plural, =0 {لا رسائل} one {رسالة واحدة} two {رسالتان} few {# رسائل} many {# رسالة} other {# رسالة}}"
```

### Namespace: `trade` (trading interface)
```
trade:order.confirm_btn   "Confirm Trade" / "確認交易" / "تأكيد التداول" / ...
trade:order.cancel_link   "Cancel Order" / "取消訂單" / "إلغاء الأمر" / ...
trade:order.purchased     "You purchased {amount, number} {asset} for {price, number, ::currency/USD}"
                          / "您以 {price, number, ::currency/USD} 購買了 {amount, number} {asset}"
                          / "لقد اشتريت {amount, number} {asset} بمبلغ {price, number, ::currency/USD}"
trade:order.type.market   "Market" / "市價" / "سوق" / ...
trade:order.type.limit    "Limit" / "限價" / "محدد" / ...
trade:order.type.trailing "Trailing Stop" / "追蹤止損" / "إيقاف متحرك" / ...  ← ko missing (shows fallback)
trade:order.count         "{count, plural, =0 {No open orders} one {# open order} other {# open orders}}"
                          / "{count, plural, =0 {لا أوامر مفتوحة} one {أمر مفتوح واحد} two {أمران مفتوحان} few {# أوامر مفتوحة} many {# أمرًا مفتوحًا} other {# أمر مفتوح}}"
trade:order.status        "{status, select, pending {Pending} filled {Filled} cancelled {Cancelled} other {Unknown}}"
                          / "{status, select, pending {قيد الانتظار} filled {تم التنفيذ} cancelled {ملغي} other {غير معروف}}"
trade:risk.warning        [tags: "compliance"]
  en: "Trading cryptocurrencies involves significant risk. You may lose all invested capital."
  zh-Hant: "加密貨幣交易涉及重大風險。您可能會損失所有投入資本。"
  ar: "ينطوي تداول العملات الرقمية على مخاطر كبيرة. قد تخسر كامل رأس المال المستثمر."
  REGION OVERRIDE — US:
    en: "Trading digital assets involves significant risk including potential total loss of invested capital. Digital assets are not legal tender and are not backed by any government. Past performance is not indicative of future results."
  REGION OVERRIDE — MENA:
    ar: "ينطوي تداول الأصول الرقمية على مخاطر كبيرة بما في ذلك الخسارة الكاملة المحتملة لرأس المال المستثمر. الأصول الرقمية ليست عملة قانونية ولا تدعمها أي حكومة. الأداء السابق لا يعد مؤشرًا على النتائج المستقبلية."
```

### Namespace: `wallet`
```
wallet:deposit.title      "Deposit" / "充值" / "إيداع" / ...
wallet:withdraw.title     "Withdraw" / "提現" / "سحب" / ...
wallet:withdraw.amount    "Withdrawal amount: {amount, number}" / "提現金額：{amount, number}" / "مبلغ السحب: {amount, number}"
wallet:balance.display    "Available: {balance, number, ::currency/USD}" / ...
wallet:transfer.confirm   "Transfer {amount, number} {asset} to {recipient}?" / "تحويل {amount, number} {asset} إلى {recipient}؟"
wallet:withdraw.disclaimer  [tags: "compliance"]
  en: "By proceeding, you acknowledge and agree to the terms of withdrawal as outlined in our User Agreement."
  zh-Hant: "繼續操作即表示您確認並同意我們用戶協議中所述之提現條款。"
  ko: "진행하시면 사용자 계약에 명시된 출금 조건에 동의하는 것입니다."
  ar: "بالمتابعة، فإنك تقر وتوافق على شروط السحب الموضحة في اتفاقية المستخدم الخاصة بنا."

  REGION OVERRIDE — US:
    en: "By proceeding, you acknowledge that this withdrawal is subject to United States financial regulations and you agree to the terms outlined in our User Agreement and US Regulatory Addendum."
    zh-Hant: "繼續操作即表示您確認此提現受美國金融法規管轄，且您同意我們用戶協議及美國法規附錄中所述之條款。"
  REGION OVERRIDE — EU:
    en: "By proceeding, you acknowledge that this withdrawal is subject to European Union financial regulations including MiCA, and you agree to the terms outlined in our User Agreement."
  REGION OVERRIDE — MENA:
    ar: "بالمتابعة، فإنك تقر بأن عملية السحب هذه تخضع للوائح المالية المعمول بها في منطقتك، وتوافق على الشروط الموضحة في اتفاقية المستخدم والملحق التنظيمي الإقليمي."
    en: "By proceeding, you acknowledge that this withdrawal is subject to applicable MENA financial regulations and you agree to the terms outlined in our User Agreement and Regional Regulatory Addendum."

wallet:earn.title           [tags: "compliance"]
  en: "Earn"
  ar: "اربح"
  REGION OVERRIDE — US:
    en: "Rewards"    ← In US, "Earn/Yield" has regulatory implications in crypto
    zh-Hant: "獎勵"
  REGION OVERRIDE — MENA:
    ar: "مكافآت"     ← Some MENA jurisdictions similarly restrict "Earn" terminology
    en: "Rewards"
```

## Seed Data Rules

### Compliance keys:
- All compliance keys must have `tags: ["compliance"]` in `translation_keys`
- English translations: `legal_approved_by: "legal_team"`, `status: "legal_approved"`
- Some non-English compliance translations: leave `legal_approved_by` as `NULL` deliberately — demonstrates publish pipeline excluding them
- Korean compliance translations: leave one as `draft` to show incomplete coverage

### Region overrides (all on compliance-tagged keys):
- **Approved (will appear in bundles):** All US and EU English overrides, MENA Arabic overrides for `wallet:withdraw.disclaimer`, US `wallet:earn.title` overrides (both en and zh-Hant). Set `legal_approved_by: "legal_team"`.
- **Pending (will be EXCLUDED — demonstrates pipeline filtering):** MENA English override for `trade:risk.warning`, MENA `wallet:earn.title` overrides. Leave `legal_approved_by: NULL`.

### Non-compliance keys:
- **⚠️ ALL non-compliance translations MUST be seeded with `status: 'approved'`** — NOT the schema default of 'draft'. The publish pipeline only includes `status IN ('approved', 'legal_approved')`. Default 'draft' = empty published bundles = broken demo.
- en: 100% coverage, all `status: 'approved'`
- zh-Hant: high coverage, all `status: 'approved'`
- ar: high coverage, all `status: 'approved'`
- zh-Hans: high coverage, all `status: 'approved'`
- ko, ja, es: partial coverage, all present translations `status: 'approved'`
- de: minimal (common only), `status: 'approved'`
- zh-Hant-TW, ar-SA: partial (few keys, to demonstrate fallback), `status: 'approved'`

## Initial Publish

Seed data must result in an initial published version so the demo has bundles on first load. Since the publish pipeline requires TypeScript (ICU validation, manifest generation), it cannot run in raw SQL. Therefore:
- `seed.sql` inserts data only
- `migrations.ts` runs: (1) schema.sql, (2) seed.sql, (3) programmatically calls the publish pipeline function to generate version 1
- This ensures ICU validation catches any syntax errors in seeded translations

## Arabic Plural Note

Arabic has six plural forms: `zero`, `one`, `two`, `few`, `many`, `other`. Example:
```
{count, plural,
  =0 {لا أوامر مفتوحة}
  one {أمر مفتوح واحد}
  two {أمران مفتوحان}
  few {# أوامر مفتوحة}
  many {# أمرًا مفتوحًا}
  other {# أمر مفتوح}
}
```

The publish pipeline should warn (not block) if an Arabic plural is missing categories. QA often only tests count=1 and count=5, missing the `two` and `few` forms.
