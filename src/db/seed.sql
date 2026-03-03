-- ============================================================
-- NAMESPACES
-- ============================================================
INSERT INTO namespaces (id, description) VALUES
  ('common', 'Shared UI elements — navigation, buttons, errors'),
  ('trade',  'Trading interface — orders, risk warnings'),
  ('wallet', 'Wallet interface — deposits, withdrawals, earn');

-- ============================================================
-- LOCALE METADATA (14 locales)
-- ============================================================
INSERT INTO locale_metadata (locale, direction, display_name, english_name, script, enabled) VALUES
  ('en',         'ltr', 'English',              'English',                       'Latn', 1),
  ('zh-Hant',    'ltr', '繁體中文',              'Traditional Chinese',           'Hant', 1),
  ('zh-Hant-TW', 'ltr', '繁體中文（台灣）',       'Traditional Chinese (Taiwan)',   'Hant', 1),
  ('zh-Hant-HK', 'ltr', '繁體中文（香港）',       'Traditional Chinese (Hong Kong)','Hant', 1),
  ('zh-Hans',    'ltr', '简体中文',              'Simplified Chinese',            'Hans', 1),
  ('zh-Hans-CN', 'ltr', '简体中文（中国）',       'Simplified Chinese (China)',     'Hans', 1),
  ('ar',         'rtl', 'العربية',              'Arabic',                        'Arab', 1),
  ('ar-SA',      'rtl', 'العربية (السعودية)',   'Arabic (Saudi Arabia)',          'Arab', 1),
  ('ar-EG',      'rtl', 'العربية (مصر)',        'Arabic (Egypt)',                'Arab', 1),
  ('ko',         'ltr', '한국어',                'Korean',                        'Kore', 1),
  ('ja',         'ltr', '日本語',                'Japanese',                      'Jpan', 1),
  ('es',         'ltr', 'Español',              'Spanish',                       'Latn', 1),
  ('es-LA',      'ltr', 'Español (Latinoamérica)','Spanish (Latin America)',      'Latn', 1),
  ('de',         'ltr', 'Deutsch',              'German',                        'Latn', 1);

-- ============================================================
-- FALLBACK CHAINS
-- ============================================================
INSERT INTO fallback_configs (locale, fallback_chain) VALUES
  ('en',         '[]'),
  ('zh-Hant-TW', '["zh-Hant", "zh-Hant-HK", "en"]'),
  ('zh-Hant-HK', '["zh-Hant", "en"]'),
  ('zh-Hans-CN', '["zh-Hans", "en"]'),
  ('ar',         '["en"]'),
  ('ar-SA',      '["ar", "en"]'),
  ('ar-EG',      '["ar", "en"]'),
  ('ko',         '["en"]'),
  ('ja',         '["en"]'),
  ('es-LA',      '["es", "en"]'),
  ('de',         '["en"]');

-- ============================================================
-- TRANSLATION KEYS
-- ============================================================

-- common namespace (10 keys)
INSERT INTO translation_keys (id, namespace_id, description, tags) VALUES
  ('common:nav.home',      'common', 'Home navigation link',    '[]'),
  ('common:nav.trade',     'common', 'Trade navigation link',   '[]'),
  ('common:nav.wallet',    'common', 'Wallet navigation link',  '[]'),
  ('common:btn.confirm',   'common', 'Confirm button',          '[]'),
  ('common:btn.cancel',    'common', 'Cancel button',           '[]'),
  ('common:btn.next',      'common', 'Next button',             '[]'),
  ('common:btn.submit',    'common', 'Submit button',           '[]'),
  ('common:error.network', 'common', 'Network error message',   '[]'),
  ('common:error.generic', 'common', 'Generic error message',   '[]'),
  ('common:inbox.count',   'common', 'Inbox message count (ICU plural)', '[]');

-- trade namespace (7 keys)
INSERT INTO translation_keys (id, namespace_id, description, tags) VALUES
  ('trade:order.confirm_btn',  'trade', 'Confirm trade button',              '[]'),
  ('trade:order.cancel_link',  'trade', 'Cancel order link',                 '[]'),
  ('trade:order.purchased',    'trade', 'Purchase confirmation (ICU number/currency)', '[]'),
  ('trade:order.type.market',  'trade', 'Market order type label',           '[]'),
  ('trade:order.type.limit',   'trade', 'Limit order type label',            '[]'),
  ('trade:order.type.trailing','trade', 'Trailing stop order type label',    '[]'),
  ('trade:order.count',        'trade', 'Open orders count (ICU plural)',    '[]'),
  ('trade:order.status',       'trade', 'Order status select (ICU select)',  '[]'),
  ('trade:risk.warning',       'trade', 'Risk warning disclaimer',           '["compliance"]');

-- wallet namespace (6 keys)
INSERT INTO translation_keys (id, namespace_id, description, tags) VALUES
  ('wallet:deposit.title',       'wallet', 'Deposit page title',                '[]'),
  ('wallet:withdraw.title',      'wallet', 'Withdraw page title',               '[]'),
  ('wallet:withdraw.amount',     'wallet', 'Withdrawal amount (ICU number)',     '[]'),
  ('wallet:balance.display',     'wallet', 'Balance display (ICU currency)',     '[]'),
  ('wallet:transfer.confirm',    'wallet', 'Transfer confirmation prompt',       '[]'),
  ('wallet:withdraw.disclaimer', 'wallet', 'Withdrawal disclaimer',             '["compliance"]'),
  ('wallet:earn.title',          'wallet', 'Earn/Rewards section title',         '["compliance"]');

-- ============================================================
-- TRANSLATIONS
-- ============================================================

-- === COMMON NAMESPACE ===

-- en: 100% coverage, status='approved'
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',      'en', 'Home',                                'approved', 'translator_1'),
  ('common:nav.trade',     'en', 'Trade',                               'approved', 'translator_1'),
  ('common:nav.wallet',    'en', 'Wallet',                              'approved', 'translator_1'),
  ('common:btn.confirm',   'en', 'Confirm',                             'approved', 'translator_1'),
  ('common:btn.cancel',    'en', 'Cancel',                              'approved', 'translator_1'),
  ('common:btn.next',      'en', 'Next',                                'approved', 'translator_1'),
  ('common:btn.submit',    'en', 'Submit',                              'approved', 'translator_1'),
  ('common:error.network', 'en', 'Network error. Please try again.',    'approved', 'translator_1'),
  ('common:error.generic', 'en', 'Something went wrong.',               'approved', 'translator_1'),
  ('common:inbox.count',   'en', 'You have {count, plural, =0 {no messages} one {# message} other {# messages}}', 'approved', 'translator_1');

-- zh-Hant: high coverage
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',      'zh-Hant', '首頁',                   'approved', 'translator_2'),
  ('common:nav.trade',     'zh-Hant', '交易',                   'approved', 'translator_2'),
  ('common:nav.wallet',    'zh-Hant', '錢包',                   'approved', 'translator_2'),
  ('common:btn.confirm',   'zh-Hant', '確認',                   'approved', 'translator_2'),
  ('common:btn.cancel',    'zh-Hant', '取消',                   'approved', 'translator_2'),
  ('common:btn.next',      'zh-Hant', '下一步',                  'approved', 'translator_2'),
  ('common:btn.submit',    'zh-Hant', '提交',                   'approved', 'translator_2'),
  ('common:error.network', 'zh-Hant', '網路錯誤，請重試。',        'approved', 'translator_2'),
  ('common:error.generic', 'zh-Hant', '發生錯誤。',              'approved', 'translator_2'),
  ('common:inbox.count',   'zh-Hant', '您有 {count, plural, other {# 則訊息}}', 'approved', 'translator_2');

-- zh-Hans: high coverage
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',      'zh-Hans', '首页',                   'approved', 'translator_3'),
  ('common:nav.trade',     'zh-Hans', '交易',                   'approved', 'translator_3'),
  ('common:nav.wallet',    'zh-Hans', '钱包',                   'approved', 'translator_3'),
  ('common:btn.confirm',   'zh-Hans', '确认',                   'approved', 'translator_3'),
  ('common:btn.cancel',    'zh-Hans', '取消',                   'approved', 'translator_3'),
  ('common:btn.next',      'zh-Hans', '下一步',                  'approved', 'translator_3'),
  ('common:btn.submit',    'zh-Hans', '提交',                   'approved', 'translator_3'),
  ('common:error.network', 'zh-Hans', '网络错误，请重试。',        'approved', 'translator_3'),
  ('common:error.generic', 'zh-Hans', '发生错误。',              'approved', 'translator_3'),
  ('common:inbox.count',   'zh-Hans', '您有 {count, plural, other {# 条消息}}', 'approved', 'translator_3');

-- ar: high coverage
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',      'ar', 'الرئيسية',                                  'approved', 'translator_4'),
  ('common:nav.trade',     'ar', 'تداول',                                     'approved', 'translator_4'),
  ('common:nav.wallet',    'ar', 'المحفظة',                                    'approved', 'translator_4'),
  ('common:btn.confirm',   'ar', 'تأكيد',                                     'approved', 'translator_4'),
  ('common:btn.cancel',    'ar', 'إلغاء',                                     'approved', 'translator_4'),
  ('common:btn.next',      'ar', 'التالي',                                    'approved', 'translator_4'),
  ('common:btn.submit',    'ar', 'إرسال',                                     'approved', 'translator_4'),
  ('common:error.network', 'ar', 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',     'approved', 'translator_4'),
  ('common:error.generic', 'ar', 'حدث خطأ ما.',                               'approved', 'translator_4'),
  ('common:inbox.count',   'ar', 'لديك {count, plural, =0 {لا رسائل} one {رسالة واحدة} two {رسالتان} few {# رسائل} many {# رسالة} other {# رسالة}}', 'approved', 'translator_4');

-- ko: partial coverage (common only)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',    'ko', '홈',     'approved', 'translator_5'),
  ('common:nav.trade',   'ko', '거래',   'approved', 'translator_5'),
  ('common:nav.wallet',  'ko', '지갑',   'approved', 'translator_5'),
  ('common:btn.confirm', 'ko', '확인',   'approved', 'translator_5'),
  ('common:btn.cancel',  'ko', '취소',   'approved', 'translator_5');

-- ja: partial
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',    'ja', 'ホーム',  'approved', 'translator_6'),
  ('common:nav.trade',   'ja', '取引',   'approved', 'translator_6'),
  ('common:nav.wallet',  'ja', 'ウォレット', 'approved', 'translator_6'),
  ('common:btn.confirm', 'ja', '確認',   'approved', 'translator_6'),
  ('common:btn.cancel',  'ja', 'キャンセル', 'approved', 'translator_6');

-- es: partial
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',    'es', 'Inicio',    'approved', 'translator_7'),
  ('common:nav.trade',   'es', 'Comerciar', 'approved', 'translator_7'),
  ('common:nav.wallet',  'es', 'Billetera', 'approved', 'translator_7'),
  ('common:btn.confirm', 'es', 'Confirmar', 'approved', 'translator_7'),
  ('common:btn.cancel',  'es', 'Cancelar',  'approved', 'translator_7');

-- de: minimal (common only)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',    'de', 'Startseite',  'approved', 'translator_8'),
  ('common:nav.trade',   'de', 'Handeln',     'approved', 'translator_8'),
  ('common:nav.wallet',  'de', 'Geldbörse',   'approved', 'translator_8'),
  ('common:btn.confirm', 'de', 'Bestätigen',  'approved', 'translator_8'),
  ('common:btn.cancel',  'de', 'Abbrechen',   'approved', 'translator_8');

-- zh-Hant-TW: partial (demonstrates fallback to zh-Hant)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',  'zh-Hant-TW', '首頁',  'approved', 'translator_2'),
  ('common:btn.confirm','zh-Hant-TW', '確認',  'approved', 'translator_2');

-- ar-SA: partial (demonstrates fallback to ar)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('common:nav.home',  'ar-SA', 'الرئيسية',  'approved', 'translator_4'),
  ('common:btn.confirm','ar-SA', 'تأكيد',    'approved', 'translator_4');

-- === TRADE NAMESPACE ===

-- en: 100%
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'en', 'Confirm Trade',   'approved', 'translator_1'),
  ('trade:order.cancel_link',  'en', 'Cancel Order',    'approved', 'translator_1'),
  ('trade:order.purchased',    'en', 'You purchased {amount, number} {asset} for {price, number, ::currency/USD}', 'approved', 'translator_1'),
  ('trade:order.type.market',  'en', 'Market',          'approved', 'translator_1'),
  ('trade:order.type.limit',   'en', 'Limit',           'approved', 'translator_1'),
  ('trade:order.type.trailing','en', 'Trailing Stop',   'approved', 'translator_1'),
  ('trade:order.count',        'en', '{count, plural, =0 {No open orders} one {# open order} other {# open orders}}', 'approved', 'translator_1'),
  ('trade:order.status',       'en', '{status, select, pending {Pending} filled {Filled} cancelled {Cancelled} other {Unknown}}', 'approved', 'translator_1');

-- trade:risk.warning — compliance key, en gets legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'en', 'Trading cryptocurrencies involves significant risk. You may lose all invested capital.', 'legal_approved', 'translator_1', 'legal_team');

-- zh-Hant: high coverage trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'zh-Hant', '確認交易',    'approved', 'translator_2'),
  ('trade:order.cancel_link',  'zh-Hant', '取消訂單',    'approved', 'translator_2'),
  ('trade:order.purchased',    'zh-Hant', '您以 {price, number, ::currency/USD} 購買了 {amount, number} {asset}', 'approved', 'translator_2'),
  ('trade:order.type.market',  'zh-Hant', '市價',        'approved', 'translator_2'),
  ('trade:order.type.limit',   'zh-Hant', '限價',        'approved', 'translator_2'),
  ('trade:order.type.trailing','zh-Hant', '追蹤止損',    'approved', 'translator_2');

-- trade:risk.warning zh-Hant — compliance, approved but NO legal_approved (demonstrates exclusion)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:risk.warning', 'zh-Hant', '加密貨幣交易涉及重大風險。您可能會損失所有投入資本。', 'approved', 'translator_2');

-- zh-Hans: high coverage trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'zh-Hans', '确认交易',    'approved', 'translator_3'),
  ('trade:order.cancel_link',  'zh-Hans', '取消订单',    'approved', 'translator_3'),
  ('trade:order.type.market',  'zh-Hans', '市价',        'approved', 'translator_3'),
  ('trade:order.type.limit',   'zh-Hans', '限价',        'approved', 'translator_3');

-- ar: high coverage trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'ar', 'تأكيد التداول',    'approved', 'translator_4'),
  ('trade:order.cancel_link',  'ar', 'إلغاء الأمر',      'approved', 'translator_4'),
  ('trade:order.purchased',    'ar', 'لقد اشتريت {amount, number} {asset} بمبلغ {price, number, ::currency/USD}', 'approved', 'translator_4'),
  ('trade:order.type.market',  'ar', 'سوق',              'approved', 'translator_4'),
  ('trade:order.type.limit',   'ar', 'محدد',              'approved', 'translator_4'),
  ('trade:order.type.trailing','ar', 'إيقاف متحرك',      'approved', 'translator_4'),
  ('trade:order.count',        'ar', '{count, plural, =0 {لا أوامر مفتوحة} one {أمر مفتوح واحد} two {أمران مفتوحان} few {# أوامر مفتوحة} many {# أمرًا مفتوحًا} other {# أمر مفتوح}}', 'approved', 'translator_4'),
  ('trade:order.status',       'ar', '{status, select, pending {قيد الانتظار} filled {تم التنفيذ} cancelled {ملغي} other {غير معروف}}', 'approved', 'translator_4');

-- trade:risk.warning ar — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'ar', 'ينطوي تداول العملات الرقمية على مخاطر كبيرة. قد تخسر كامل رأس المال المستثمر.', 'legal_approved', 'translator_4', 'legal_team');

-- ko: partial trade (no trailing stop — demonstrates fallback)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn', 'ko', '거래 확인',  'approved', 'translator_5'),
  ('trade:order.cancel_link', 'ko', '주문 취소',  'approved', 'translator_5'),
  ('trade:order.type.market', 'ko', '시장가',     'approved', 'translator_5'),
  ('trade:order.type.limit',  'ko', '지정가',     'approved', 'translator_5');

-- ja: partial trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn', 'ja', '取引確認',    'approved', 'translator_6'),
  ('trade:order.cancel_link', 'ja', '注文キャンセル', 'approved', 'translator_6'),
  ('trade:order.type.market', 'ja', '成行',        'approved', 'translator_6'),
  ('trade:order.type.limit',  'ja', '指値',        'approved', 'translator_6');

-- === WALLET NAMESPACE ===

-- en: 100%
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',    'en', 'Deposit',                                    'approved', 'translator_1'),
  ('wallet:withdraw.title',   'en', 'Withdraw',                                   'approved', 'translator_1'),
  ('wallet:withdraw.amount',  'en', 'Withdrawal amount: {amount, number}',         'approved', 'translator_1'),
  ('wallet:balance.display',  'en', 'Available: {balance, number, ::currency/USD}', 'approved', 'translator_1'),
  ('wallet:transfer.confirm', 'en', 'Transfer {amount, number} {asset} to {recipient}?', 'approved', 'translator_1');

-- wallet compliance keys — en legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'en', 'By proceeding, you acknowledge and agree to the terms of withdrawal as outlined in our User Agreement.', 'legal_approved', 'translator_1', 'legal_team'),
  ('wallet:earn.title',          'en', 'Earn', 'legal_approved', 'translator_1', 'legal_team');

-- zh-Hant: wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',    'zh-Hant', '充值',                                    'approved', 'translator_2'),
  ('wallet:withdraw.title',   'zh-Hant', '提現',                                    'approved', 'translator_2'),
  ('wallet:withdraw.amount',  'zh-Hant', '提現金額：{amount, number}',                'approved', 'translator_2'),
  ('wallet:balance.display',  'zh-Hant', '可用：{balance, number, ::currency/USD}',   'approved', 'translator_2'),
  ('wallet:transfer.confirm', 'zh-Hant', '轉帳 {amount, number} {asset} 給 {recipient}？', 'approved', 'translator_2');

-- wallet compliance zh-Hant — approved but NO legal (demonstrates exclusion)
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'zh-Hant', '繼續操作即表示您確認並同意我們用戶協議中所述之提現條款。', 'approved', 'translator_2'),
  ('wallet:earn.title',          'zh-Hant', '賺取', 'approved', 'translator_2');

-- zh-Hans: wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',   'zh-Hans', '充值',  'approved', 'translator_3'),
  ('wallet:withdraw.title',  'zh-Hans', '提现',  'approved', 'translator_3'),
  ('wallet:withdraw.amount', 'zh-Hans', '提现金额：{amount, number}', 'approved', 'translator_3');

-- ar: wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',    'ar', 'إيداع',                                 'approved', 'translator_4'),
  ('wallet:withdraw.title',   'ar', 'سحب',                                  'approved', 'translator_4'),
  ('wallet:withdraw.amount',  'ar', 'مبلغ السحب: {amount, number}',           'approved', 'translator_4'),
  ('wallet:transfer.confirm', 'ar', 'تحويل {amount, number} {asset} إلى {recipient}؟', 'approved', 'translator_4');

-- wallet compliance ar — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'ar', 'بالمتابعة، فإنك تقر وتوافق على شروط السحب الموضحة في اتفاقية المستخدم الخاصة بنا.', 'legal_approved', 'translator_4', 'legal_team'),
  ('wallet:earn.title',          'ar', 'اربح', 'legal_approved', 'translator_4', 'legal_team');

-- ko: wallet compliance — deliberately left as draft to show incomplete coverage
INSERT INTO translations (key_id, locale, value, status) VALUES
  ('wallet:withdraw.disclaimer', 'ko', '진행하시면 사용자 계약에 명시된 출금 조건에 동의하는 것입니다.', 'draft');

-- ============================================================
-- REGION OVERRIDES
-- ============================================================

-- trade:risk.warning
-- US override (approved)
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('trade:risk.warning', 'en', 'US', 'Trading digital assets involves significant risk including potential total loss of invested capital. Digital assets are not legal tender and are not backed by any government. Past performance is not indicative of future results.', 'legal_team');

-- MENA override for trade:risk.warning (ar approved, en PENDING — no legal_approved_by)
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('trade:risk.warning', 'ar', 'MENA', 'ينطوي تداول الأصول الرقمية على مخاطر كبيرة بما في ذلك الخسارة الكاملة المحتملة لرأس المال المستثمر. الأصول الرقمية ليست عملة قانونية ولا تدعمها أي حكومة. الأداء السابق لا يعد مؤشرًا على النتائج المستقبلية.', 'legal_team');
INSERT INTO region_overrides (key_id, locale, region, value) VALUES
  ('trade:risk.warning', 'en', 'MENA', 'Trading digital assets involves significant risk including potential total loss of invested capital. Digital assets are not legal tender and are not backed by any government. Past performance is not indicative of future results.');

-- wallet:withdraw.disclaimer
-- US overrides (approved)
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'en', 'US', 'By proceeding, you acknowledge that this withdrawal is subject to United States financial regulations and you agree to the terms outlined in our User Agreement and US Regulatory Addendum.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hant', 'US', '繼續操作即表示您確認此提現受美國金融法規管轄，且您同意我們用戶協議及美國法規附錄中所述之條款。', 'legal_team');

-- EU override (approved)
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'en', 'EU', 'By proceeding, you acknowledge that this withdrawal is subject to European Union financial regulations including MiCA, and you agree to the terms outlined in our User Agreement.', 'legal_team');

-- MENA overrides (approved)
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'ar', 'MENA', 'بالمتابعة، فإنك تقر بأن عملية السحب هذه تخضع للوائح المالية المعمول بها في منطقتك، وتوافق على الشروط الموضحة في اتفاقية المستخدم والملحق التنظيمي الإقليمي.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'en', 'MENA', 'By proceeding, you acknowledge that this withdrawal is subject to applicable MENA financial regulations and you agree to the terms outlined in our User Agreement and Regional Regulatory Addendum.', 'legal_team');

-- wallet:earn.title
-- US overrides (approved)
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:earn.title', 'en', 'US', 'Rewards', 'legal_team'),
  ('wallet:earn.title', 'zh-Hant', 'US', '獎勵', 'legal_team');

-- MENA overrides (PENDING — no legal_approved_by, demonstrates pipeline filtering)
INSERT INTO region_overrides (key_id, locale, region, value) VALUES
  ('wallet:earn.title', 'ar', 'MENA', 'مكافآت'),
  ('wallet:earn.title', 'en', 'MENA', 'Rewards');
