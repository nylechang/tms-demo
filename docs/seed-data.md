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

### Namespace: `trade` (trading interface, 22 keys)
```
trade:order.confirm_btn   "Confirm Trade" / "確認交易" / "确认交易" / "تأكيد التداول" / ...
trade:order.cancel_link   "Cancel Order" / "取消訂單" / "取消订单" / "إلغاء الأمر" / ...
trade:order.purchased     "You purchased {amount, number} {asset} for {price, number, ::currency/USD}"
                          / "您以 {price, number, ::currency/USD} 購買了 {amount, number} {asset}"
                          / "لقد اشتريت {amount, number} {asset} بمبلغ {price, number, ::currency/USD}"
trade:order.type.market   "Market" / "市價" / "سوق" / "시장가" / "成行" / ...
trade:order.type.limit    "Limit" / "限價" / "محدد" / "지정가" / "指値" / ...
trade:order.type.trailing "Trailing Stop" / "追蹤止損" / "إيقاف متحرك" / "추적 손절" / ...
trade:order.count         "{count, plural, =0 {No open orders} one {# open order} other {# open orders}}"
                          / "{count, plural, =0 {لا أوامر مفتوحة} one {أمر مفتوح واحد} two {أمران مفتوحان} few {# أوامر مفتوحة} many {# أمرًا مفتوحًا} other {# أمر مفتوح}}"
trade:order.status        "{status, select, pending {Pending} filled {Filled} cancelled {Cancelled} other {Unknown}}"
                          / "{status, select, pending {قيد الانتظار} filled {تم التنفيذ} cancelled {ملغي} other {غير معروف}}"
trade:order.side.buy      "Buy {asset}" / "買入 {asset}" / "شراء {asset}" / ...
trade:order.side          "{side, select, buy {Buy} sell {Sell} other {Unknown}}"  ← ICU select for table display
trade:order.price_label   "Price ({currency})" / "價格 ({currency})" / "السعر ({currency})" / ...
trade:order.amount_label  "Amount ({currency})" / "數量 ({currency})" / "الكمية ({currency})" / ...
trade:order.result_label  "Result:" / "結果：" / "النتيجة:" / ...
trade:order.adjust_count  "Adjust count" / "調整數量" / "تعديل العدد" / ...
trade:table.id            "ID" (universal)
trade:table.pair          "Pair" / "交易對" / "الزوج" / "ペア" / ...
trade:table.side          "Side" / "方向" / "الاتجاه" / "売買" / ...
trade:table.amount        "Amount" / "數量" / "الكمية" / "数量" / ...
trade:table.price         "Price" / "價格" / "السعر" / "価格" / ...
trade:table.status        "Status" / "狀態" / "الحالة" / "ステータス" / ...
trade:pair.last_price     "Last Price" / "最新價格" / "آخر سعر" / ...
trade:pair.change_24h     "24h Change" / "24小時漲跌" / "التغير خلال 24 ساعة" / ...
trade:pair.vol_24h        "24h Vol" / "24小時成交量" / "حجم التداول 24 ساعة" / ...
trade:risk.warning        [tags: "compliance"]
  en: "Trading cryptocurrencies involves significant risk. You may lose all invested capital."
  zh-Hant: "加密貨幣交易涉及重大風險。您可能會損失所有投入資本。"
  ar: "ينطوي تداول العملات الرقمية على مخاطر كبيرة. قد تخسر كامل رأس المال المستثمر."
  zh-Hans, ko, ja, es, de: translated, approved but NO legal_approved (demonstrates exclusion)
  REGION OVERRIDE — US:
    en: "Trading digital assets involves significant risk including potential total loss of invested capital. Digital assets are not legal tender and are not backed by any government. Past performance is not indicative of future results."
  REGION OVERRIDE — MENA:
    ar: "ينطوي تداول الأصول الرقمية على مخاطر كبيرة بما في ذلك الخسارة الكاملة المحتملة لرأس المال المستثمر. الأصول الرقمية ليست عملة قانونية ولا تدعمها أي حكومة. الأداء السابق لا يعد مؤشرًا على النتائج المستقبلية."
```

### Namespace: `wallet` (12 keys)
```
wallet:deposit.title         "Deposit" / "充值" / "إيداع" / "入金" / "Depósito" / ...
wallet:withdraw.title        "Withdraw" / "提現" / "سحب" / "出金" / "Retiro" / ...
wallet:withdraw.amount       "Withdrawal amount: {amount, number}" / "提現金額：{amount, number}" / "مبلغ السحب: {amount, number}" / ...
wallet:balance.display       "Available: {balance, number, ::currency/USD}" / ...
wallet:transfer.confirm      "Transfer {amount, number} {asset} to {recipient}?" / "تحويل {amount, number} {asset} إلى {recipient}؟" / ...
wallet:balance.label         "Balance" / "餘額" / "الرصيد" / "残高" / "Saldo" / ...
wallet:deposit.asset_label   "Asset" / "資產" / "الأصل" / "資産" / "Activo" / ...
wallet:deposit.address_label "Address" / "地址" / "العنوان" / "アドレス" / "Dirección" / ...
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
- zh-Hant: 100% coverage (trade + wallet), all `status: 'approved'`
- ar: 100% coverage (trade + wallet), all `status: 'approved'`
- zh-Hans: 100% coverage (trade + wallet), all `status: 'approved'`
- ko: 100% coverage (trade + wallet), all `status: 'approved'`
- ja: 100% coverage (trade + wallet), all `status: 'approved'`
- es: 100% coverage (trade + wallet), all `status: 'approved'`
- de: 100% coverage (trade + wallet), common `status: 'approved'`
- zh-Hant-TW, ar-SA: partial (few keys in common, to demonstrate fallback), `status: 'approved'`

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
