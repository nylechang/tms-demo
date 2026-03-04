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

-- trade namespace (22 keys)
INSERT INTO translation_keys (id, namespace_id, description, tags) VALUES
  ('trade:order.confirm_btn',  'trade', 'Confirm trade button',              '[]'),
  ('trade:order.cancel_link',  'trade', 'Cancel order link',                 '[]'),
  ('trade:order.purchased',    'trade', 'Purchase confirmation (ICU number/currency)', '[]'),
  ('trade:order.type.market',  'trade', 'Market order type label',           '[]'),
  ('trade:order.type.limit',   'trade', 'Limit order type label',            '[]'),
  ('trade:order.type.trailing','trade', 'Trailing stop order type label',    '[]'),
  ('trade:order.count',        'trade', 'Open orders count (ICU plural)',    '[]'),
  ('trade:order.status',       'trade', 'Order status select (ICU select)',  '[]'),
  ('trade:risk.warning',       'trade', 'Risk warning disclaimer',           '["compliance"]'),
  ('trade:pair.last_price',    'trade', 'Last price label',                  '[]'),
  ('trade:pair.change_24h',    'trade', '24h change label',                  '[]'),
  ('trade:pair.vol_24h',       'trade', '24h volume label',                  '[]'),
  ('trade:order.side.buy',     'trade', 'Buy button with asset (ICU)',       '[]'),
  ('trade:order.price_label',  'trade', 'Price input label with currency param', '[]'),
  ('trade:order.amount_label', 'trade', 'Amount input label with currency param','[]'),
  ('trade:order.result_label', 'trade', 'Result prefix before purchase confirmation','[]'),
  ('trade:order.adjust_count', 'trade', 'Helper text for plural demo adjustment','[]'),
  ('trade:order.side',         'trade', 'Order side select (ICU select: buy/sell)','[]'),
  ('trade:table.id',           'trade', 'Table header: order ID',            '[]'),
  ('trade:table.pair',         'trade', 'Table header: trading pair',        '[]'),
  ('trade:table.side',         'trade', 'Table header: buy/sell side',       '[]'),
  ('trade:table.amount',       'trade', 'Table header: order amount',        '[]'),
  ('trade:table.price',        'trade', 'Table header: order price',         '[]'),
  ('trade:table.status',       'trade', 'Table header: order status',        '[]');

-- wallet namespace (12 keys)
INSERT INTO translation_keys (id, namespace_id, description, tags) VALUES
  ('wallet:deposit.title',        'wallet', 'Deposit page title',                '[]'),
  ('wallet:withdraw.title',       'wallet', 'Withdraw page title',               '[]'),
  ('wallet:withdraw.amount',      'wallet', 'Withdrawal amount (ICU number)',     '[]'),
  ('wallet:balance.display',      'wallet', 'Balance display (ICU currency)',     '[]'),
  ('wallet:transfer.confirm',     'wallet', 'Transfer confirmation prompt',       '[]'),
  ('wallet:withdraw.disclaimer',  'wallet', 'Withdrawal disclaimer',             '["compliance"]'),
  ('wallet:earn.title',           'wallet', 'Earn/Rewards section title',         '["compliance"]'),
  ('wallet:earn.holdings',        'wallet', 'My Holdings label',                  '[]'),
  ('wallet:earn.total_profit',    'wallet', 'Total Profit label',                 '[]'),
  ('wallet:earn.last_day_profit', 'wallet', 'Last Day Profit label',              '[]'),
  ('wallet:balance.label',        'wallet', 'Balance section label',              '[]'),
  ('wallet:deposit.asset_label',  'wallet', 'Deposit form asset label',           '[]'),
  ('wallet:deposit.address_label','wallet', 'Deposit form address label',         '[]');

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
  ('trade:order.status',       'en', '{status, select, pending {Pending} filled {Filled} cancelled {Cancelled} other {Unknown}}', 'approved', 'translator_1'),
  ('trade:pair.last_price',    'en', 'Last Price',       'approved', 'translator_1'),
  ('trade:pair.change_24h',    'en', '24h Change',       'approved', 'translator_1'),
  ('trade:pair.vol_24h',       'en', '24h Vol',          'approved', 'translator_1'),
  ('trade:order.side.buy',     'en', 'Buy {asset}',      'approved', 'translator_1'),
  ('trade:order.price_label',  'en', 'Price ({currency})',  'approved', 'translator_1'),
  ('trade:order.amount_label', 'en', 'Amount ({currency})', 'approved', 'translator_1'),
  ('trade:order.result_label', 'en', 'Result:',           'approved', 'translator_1'),
  ('trade:order.adjust_count', 'en', 'Adjust count',      'approved', 'translator_1'),
  ('trade:order.side',         'en', '{side, select, buy {Buy} sell {Sell} other {Unknown}}', 'approved', 'translator_1'),
  ('trade:table.id',           'en', 'ID',                'approved', 'translator_1'),
  ('trade:table.pair',         'en', 'Pair',              'approved', 'translator_1'),
  ('trade:table.side',         'en', 'Side',              'approved', 'translator_1'),
  ('trade:table.amount',       'en', 'Amount',            'approved', 'translator_1'),
  ('trade:table.price',        'en', 'Price',             'approved', 'translator_1'),
  ('trade:table.status',       'en', 'Status',            'approved', 'translator_1');

-- trade:risk.warning — compliance key, en gets legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'en', 'Trading cryptocurrencies involves significant risk. You may lose all invested capital.', 'legal_approved', 'translator_1', 'legal_team');

-- zh-Hant: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'zh-Hant', '確認交易',    'approved', 'translator_2'),
  ('trade:order.cancel_link',  'zh-Hant', '取消訂單',    'approved', 'translator_2'),
  ('trade:order.purchased',    'zh-Hant', '您以 {price, number, ::currency/USD} 購買了 {amount, number} {asset}', 'approved', 'translator_2'),
  ('trade:order.type.market',  'zh-Hant', '市價',        'approved', 'translator_2'),
  ('trade:order.type.limit',   'zh-Hant', '限價',        'approved', 'translator_2'),
  ('trade:order.type.trailing','zh-Hant', '追蹤止損',    'approved', 'translator_2'),
  ('trade:order.count',        'zh-Hant', '{count, plural, =0 {沒有未結訂單} other {# 筆未結訂單}}', 'approved', 'translator_2'),
  ('trade:order.status',       'zh-Hant', '{status, select, pending {待處理} filled {已成交} cancelled {已取消} other {未知}}', 'approved', 'translator_2'),
  ('trade:pair.last_price',    'zh-Hant', '最新價格',    'approved', 'translator_2'),
  ('trade:pair.change_24h',    'zh-Hant', '24小時漲跌',  'approved', 'translator_2'),
  ('trade:pair.vol_24h',       'zh-Hant', '24小時成交量', 'approved', 'translator_2'),
  ('trade:order.side.buy',     'zh-Hant', '買入 {asset}', 'approved', 'translator_2'),
  ('trade:order.price_label',  'zh-Hant', '價格 ({currency})',  'approved', 'translator_2'),
  ('trade:order.amount_label', 'zh-Hant', '數量 ({currency})',  'approved', 'translator_2'),
  ('trade:order.result_label', 'zh-Hant', '結果：',             'approved', 'translator_2'),
  ('trade:order.adjust_count', 'zh-Hant', '調整數量',           'approved', 'translator_2'),
  ('trade:order.side',         'zh-Hant', '{side, select, buy {買入} sell {賣出} other {未知}}', 'approved', 'translator_2'),
  ('trade:table.id',           'zh-Hant', 'ID',                'approved', 'translator_2'),
  ('trade:table.pair',         'zh-Hant', '交易對',             'approved', 'translator_2'),
  ('trade:table.side',         'zh-Hant', '方向',               'approved', 'translator_2'),
  ('trade:table.amount',       'zh-Hant', '數量',               'approved', 'translator_2'),
  ('trade:table.price',        'zh-Hant', '價格',               'approved', 'translator_2'),
  ('trade:table.status',       'zh-Hant', '狀態',               'approved', 'translator_2');

-- trade:risk.warning zh-Hant — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'zh-Hant', '加密貨幣交易涉及重大風險。您可能會損失所有投入資本。', 'legal_approved', 'translator_2', 'legal_team');

-- zh-Hans: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'zh-Hans', '确认交易',    'approved', 'translator_3'),
  ('trade:order.cancel_link',  'zh-Hans', '取消订单',    'approved', 'translator_3'),
  ('trade:order.purchased',    'zh-Hans', '您以 {price, number, ::currency/USD} 购买了 {amount, number} {asset}', 'approved', 'translator_3'),
  ('trade:order.type.market',  'zh-Hans', '市价',        'approved', 'translator_3'),
  ('trade:order.type.limit',   'zh-Hans', '限价',        'approved', 'translator_3'),
  ('trade:order.type.trailing','zh-Hans', '追踪止损',    'approved', 'translator_3'),
  ('trade:order.count',        'zh-Hans', '{count, plural, =0 {没有未结订单} other {# 笔未结订单}}', 'approved', 'translator_3'),
  ('trade:order.status',       'zh-Hans', '{status, select, pending {待处理} filled {已成交} cancelled {已取消} other {未知}}', 'approved', 'translator_3'),
  ('trade:pair.last_price',    'zh-Hans', '最新价格',    'approved', 'translator_3'),
  ('trade:pair.change_24h',    'zh-Hans', '24小时涨跌',  'approved', 'translator_3'),
  ('trade:pair.vol_24h',       'zh-Hans', '24小时成交量', 'approved', 'translator_3'),
  ('trade:order.side.buy',     'zh-Hans', '买入 {asset}', 'approved', 'translator_3'),
  ('trade:order.price_label',  'zh-Hans', '价格 ({currency})',  'approved', 'translator_3'),
  ('trade:order.amount_label', 'zh-Hans', '数量 ({currency})',  'approved', 'translator_3'),
  ('trade:order.result_label', 'zh-Hans', '结果：',             'approved', 'translator_3'),
  ('trade:order.adjust_count', 'zh-Hans', '调整数量',           'approved', 'translator_3'),
  ('trade:order.side',         'zh-Hans', '{side, select, buy {买入} sell {卖出} other {未知}}', 'approved', 'translator_3'),
  ('trade:table.id',           'zh-Hans', 'ID',                'approved', 'translator_3'),
  ('trade:table.pair',         'zh-Hans', '交易对',             'approved', 'translator_3'),
  ('trade:table.side',         'zh-Hans', '方向',               'approved', 'translator_3'),
  ('trade:table.amount',       'zh-Hans', '数量',               'approved', 'translator_3'),
  ('trade:table.price',        'zh-Hans', '价格',               'approved', 'translator_3'),
  ('trade:table.status',       'zh-Hans', '状态',               'approved', 'translator_3');

-- trade:risk.warning zh-Hans — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'zh-Hans', '加密货币交易涉及重大风险。您可能会损失所有投入资本。', 'legal_approved', 'translator_3', 'legal_team');

-- ar: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'ar', 'تأكيد التداول',    'approved', 'translator_4'),
  ('trade:order.cancel_link',  'ar', 'إلغاء الأمر',      'approved', 'translator_4'),
  ('trade:order.purchased',    'ar', 'لقد اشتريت {amount, number} {asset} بمبلغ {price, number, ::currency/USD}', 'approved', 'translator_4'),
  ('trade:order.type.market',  'ar', 'سوق',              'approved', 'translator_4'),
  ('trade:order.type.limit',   'ar', 'محدد',              'approved', 'translator_4'),
  ('trade:order.type.trailing','ar', 'إيقاف متحرك',      'approved', 'translator_4'),
  ('trade:order.count',        'ar', '{count, plural, =0 {لا أوامر مفتوحة} one {أمر مفتوح واحد} two {أمران مفتوحان} few {# أوامر مفتوحة} many {# أمرًا مفتوحًا} other {# أمر مفتوح}}', 'approved', 'translator_4'),
  ('trade:order.status',       'ar', '{status, select, pending {قيد الانتظار} filled {تم التنفيذ} cancelled {ملغي} other {غير معروف}}', 'approved', 'translator_4'),
  ('trade:pair.last_price',    'ar', 'آخر سعر',                   'approved', 'translator_4'),
  ('trade:pair.change_24h',    'ar', 'التغير خلال 24 ساعة',       'approved', 'translator_4'),
  ('trade:pair.vol_24h',       'ar', 'حجم التداول 24 ساعة',       'approved', 'translator_4'),
  ('trade:order.side.buy',     'ar', 'شراء {asset}',              'approved', 'translator_4'),
  ('trade:order.price_label',  'ar', 'السعر ({currency})',         'approved', 'translator_4'),
  ('trade:order.amount_label', 'ar', 'الكمية ({currency})',        'approved', 'translator_4'),
  ('trade:order.result_label', 'ar', 'النتيجة:',                   'approved', 'translator_4'),
  ('trade:order.adjust_count', 'ar', 'تعديل العدد',                'approved', 'translator_4'),
  ('trade:order.side',         'ar', '{side, select, buy {شراء} sell {بيع} other {غير معروف}}', 'approved', 'translator_4'),
  ('trade:table.id',           'ar', 'المعرّف',                    'approved', 'translator_4'),
  ('trade:table.pair',         'ar', 'الزوج',                      'approved', 'translator_4'),
  ('trade:table.side',         'ar', 'الاتجاه',                    'approved', 'translator_4'),
  ('trade:table.amount',       'ar', 'الكمية',                     'approved', 'translator_4'),
  ('trade:table.price',        'ar', 'السعر',                      'approved', 'translator_4'),
  ('trade:table.status',       'ar', 'الحالة',                     'approved', 'translator_4');

-- trade:risk.warning ar — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'ar', 'ينطوي تداول العملات الرقمية على مخاطر كبيرة. قد تخسر كامل رأس المال المستثمر.', 'legal_approved', 'translator_4', 'legal_team');

-- ko: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'ko', '거래 확인',  'approved', 'translator_5'),
  ('trade:order.cancel_link',  'ko', '주문 취소',  'approved', 'translator_5'),
  ('trade:order.purchased',    'ko', '{price, number, ::currency/USD}에 {amount, number} {asset}을(를) 구매했습니다', 'approved', 'translator_5'),
  ('trade:order.type.market',  'ko', '시장가',     'approved', 'translator_5'),
  ('trade:order.type.limit',   'ko', '지정가',     'approved', 'translator_5'),
  ('trade:order.type.trailing','ko', '추적 손절',  'approved', 'translator_5'),
  ('trade:order.count',        'ko', '{count, plural, =0 {미체결 주문 없음} other {미체결 주문 #건}}', 'approved', 'translator_5'),
  ('trade:order.status',       'ko', '{status, select, pending {대기중} filled {체결} cancelled {취소됨} other {알 수 없음}}', 'approved', 'translator_5'),
  ('trade:pair.last_price',    'ko', '최근 가격',      'approved', 'translator_5'),
  ('trade:pair.change_24h',    'ko', '24시간 변동',    'approved', 'translator_5'),
  ('trade:pair.vol_24h',       'ko', '24시간 거래량',  'approved', 'translator_5'),
  ('trade:order.side.buy',     'ko', '{asset} 매수',   'approved', 'translator_5'),
  ('trade:order.price_label',  'ko', '가격 ({currency})',  'approved', 'translator_5'),
  ('trade:order.amount_label', 'ko', '수량 ({currency})',  'approved', 'translator_5'),
  ('trade:order.result_label', 'ko', '결과:',              'approved', 'translator_5'),
  ('trade:order.adjust_count', 'ko', '수량 조정',          'approved', 'translator_5'),
  ('trade:order.side',         'ko', '{side, select, buy {매수} sell {매도} other {알 수 없음}}', 'approved', 'translator_5'),
  ('trade:table.id',           'ko', 'ID',                'approved', 'translator_5'),
  ('trade:table.pair',         'ko', '페어',              'approved', 'translator_5'),
  ('trade:table.side',         'ko', '유형',              'approved', 'translator_5'),
  ('trade:table.amount',       'ko', '수량',              'approved', 'translator_5'),
  ('trade:table.price',        'ko', '가격',              'approved', 'translator_5'),
  ('trade:table.status',       'ko', '상태',              'approved', 'translator_5');

-- trade:risk.warning ko — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'ko', '암호화폐 거래에는 상당한 위험이 따릅니다. 투자한 원금 전액을 잃을 수 있습니다.', 'legal_approved', 'translator_5', 'legal_team');

-- ja: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'ja', '取引確認',      'approved', 'translator_6'),
  ('trade:order.cancel_link',  'ja', '注文キャンセル', 'approved', 'translator_6'),
  ('trade:order.purchased',    'ja', '{amount, number} {asset} を {price, number, ::currency/USD} で購入しました', 'approved', 'translator_6'),
  ('trade:order.type.market',  'ja', '成行',          'approved', 'translator_6'),
  ('trade:order.type.limit',   'ja', '指値',          'approved', 'translator_6'),
  ('trade:order.type.trailing','ja', 'トレーリングストップ', 'approved', 'translator_6'),
  ('trade:order.count',        'ja', '{count, plural, =0 {未約定の注文はありません} other {未約定の注文 #件}}', 'approved', 'translator_6'),
  ('trade:order.status',       'ja', '{status, select, pending {保留中} filled {約定済} cancelled {取消済} other {不明}}', 'approved', 'translator_6'),
  ('trade:pair.last_price',    'ja', '最終価格',       'approved', 'translator_6'),
  ('trade:pair.change_24h',    'ja', '24時間変動',     'approved', 'translator_6'),
  ('trade:pair.vol_24h',       'ja', '24時間出来高',   'approved', 'translator_6'),
  ('trade:order.side.buy',     'ja', '{asset} を購入', 'approved', 'translator_6'),
  ('trade:order.price_label',  'ja', '価格 ({currency})',  'approved', 'translator_6'),
  ('trade:order.amount_label', 'ja', '数量 ({currency})',  'approved', 'translator_6'),
  ('trade:order.result_label', 'ja', '結果：',             'approved', 'translator_6'),
  ('trade:order.adjust_count', 'ja', '数量を調整',         'approved', 'translator_6'),
  ('trade:order.side',         'ja', '{side, select, buy {買い} sell {売り} other {不明}}', 'approved', 'translator_6'),
  ('trade:table.id',           'ja', 'ID',                'approved', 'translator_6'),
  ('trade:table.pair',         'ja', 'ペア',              'approved', 'translator_6'),
  ('trade:table.side',         'ja', '売買',              'approved', 'translator_6'),
  ('trade:table.amount',       'ja', '数量',              'approved', 'translator_6'),
  ('trade:table.price',        'ja', '価格',              'approved', 'translator_6'),
  ('trade:table.status',       'ja', 'ステータス',        'approved', 'translator_6');

-- trade:risk.warning ja — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'ja', '暗号資産の取引には大きなリスクが伴います。投資元本のすべてを失う可能性があります。', 'legal_approved', 'translator_6', 'legal_team');

-- es: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'es', 'Confirmar operación', 'approved', 'translator_7'),
  ('trade:order.cancel_link',  'es', 'Cancelar orden',      'approved', 'translator_7'),
  ('trade:order.purchased',    'es', 'Compraste {amount, number} {asset} por {price, number, ::currency/USD}', 'approved', 'translator_7'),
  ('trade:order.type.market',  'es', 'Mercado',             'approved', 'translator_7'),
  ('trade:order.type.limit',   'es', 'Límite',              'approved', 'translator_7'),
  ('trade:order.type.trailing','es', 'Trailing Stop',       'approved', 'translator_7'),
  ('trade:order.count',        'es', '{count, plural, =0 {Sin órdenes abiertas} one {# orden abierta} other {# órdenes abiertas}}', 'approved', 'translator_7'),
  ('trade:order.status',       'es', '{status, select, pending {Pendiente} filled {Ejecutada} cancelled {Cancelada} other {Desconocido}}', 'approved', 'translator_7'),
  ('trade:pair.last_price',    'es', 'Último precio',       'approved', 'translator_7'),
  ('trade:pair.change_24h',    'es', 'Cambio 24h',          'approved', 'translator_7'),
  ('trade:pair.vol_24h',       'es', 'Vol. 24h',            'approved', 'translator_7'),
  ('trade:order.side.buy',     'es', 'Comprar {asset}',     'approved', 'translator_7'),
  ('trade:order.price_label',  'es', 'Precio ({currency})',    'approved', 'translator_7'),
  ('trade:order.amount_label', 'es', 'Cantidad ({currency})',  'approved', 'translator_7'),
  ('trade:order.result_label', 'es', 'Resultado:',             'approved', 'translator_7'),
  ('trade:order.adjust_count', 'es', 'Ajustar cantidad',       'approved', 'translator_7'),
  ('trade:order.side',         'es', '{side, select, buy {Compra} sell {Venta} other {Desconocido}}', 'approved', 'translator_7'),
  ('trade:table.id',           'es', 'ID',                     'approved', 'translator_7'),
  ('trade:table.pair',         'es', 'Par',                    'approved', 'translator_7'),
  ('trade:table.side',         'es', 'Tipo',                   'approved', 'translator_7'),
  ('trade:table.amount',       'es', 'Cantidad',               'approved', 'translator_7'),
  ('trade:table.price',        'es', 'Precio',                 'approved', 'translator_7'),
  ('trade:table.status',       'es', 'Estado',                 'approved', 'translator_7');

-- trade:risk.warning es — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'es', 'El comercio de criptomonedas implica riesgos significativos. Puede perder todo el capital invertido.', 'legal_approved', 'translator_7', 'legal_team');

-- de: 100% trade
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('trade:order.confirm_btn',  'de', 'Handel bestätigen',  'approved', 'translator_8'),
  ('trade:order.cancel_link',  'de', 'Auftrag stornieren', 'approved', 'translator_8'),
  ('trade:order.purchased',    'de', 'Sie haben {amount, number} {asset} für {price, number, ::currency/USD} gekauft', 'approved', 'translator_8'),
  ('trade:order.type.market',  'de', 'Markt',              'approved', 'translator_8'),
  ('trade:order.type.limit',   'de', 'Limit',              'approved', 'translator_8'),
  ('trade:order.type.trailing','de', 'Trailing Stop',      'approved', 'translator_8'),
  ('trade:order.count',        'de', '{count, plural, =0 {Keine offenen Aufträge} one {# offener Auftrag} other {# offene Aufträge}}', 'approved', 'translator_8'),
  ('trade:order.status',       'de', '{status, select, pending {Ausstehend} filled {Ausgeführt} cancelled {Storniert} other {Unbekannt}}', 'approved', 'translator_8'),
  ('trade:pair.last_price',    'de', 'Letzter Preis',      'approved', 'translator_8'),
  ('trade:pair.change_24h',    'de', '24h Änderung',       'approved', 'translator_8'),
  ('trade:pair.vol_24h',       'de', '24h Vol.',            'approved', 'translator_8'),
  ('trade:order.side.buy',     'de', '{asset} kaufen',     'approved', 'translator_8'),
  ('trade:order.price_label',  'de', 'Preis ({currency})',    'approved', 'translator_8'),
  ('trade:order.amount_label', 'de', 'Menge ({currency})',    'approved', 'translator_8'),
  ('trade:order.result_label', 'de', 'Ergebnis:',             'approved', 'translator_8'),
  ('trade:order.adjust_count', 'de', 'Anzahl anpassen',       'approved', 'translator_8'),
  ('trade:order.side',         'de', '{side, select, buy {Kauf} sell {Verkauf} other {Unbekannt}}', 'approved', 'translator_8'),
  ('trade:table.id',           'de', 'ID',                    'approved', 'translator_8'),
  ('trade:table.pair',         'de', 'Paar',                  'approved', 'translator_8'),
  ('trade:table.side',         'de', 'Seite',                 'approved', 'translator_8'),
  ('trade:table.amount',       'de', 'Menge',                 'approved', 'translator_8'),
  ('trade:table.price',        'de', 'Preis',                 'approved', 'translator_8'),
  ('trade:table.status',       'de', 'Status',                'approved', 'translator_8');

-- trade:risk.warning de — compliance, legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('trade:risk.warning', 'de', 'Der Handel mit Kryptowährungen birgt erhebliche Risiken. Sie können Ihr gesamtes investiertes Kapital verlieren.', 'legal_approved', 'translator_8', 'legal_team');

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

INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:earn.holdings',        'en', 'My Holdings',      'approved', 'translator_1'),
  ('wallet:earn.total_profit',    'en', 'Total Profit',     'approved', 'translator_1'),
  ('wallet:earn.last_day_profit', 'en', 'Last Day Profit',  'approved', 'translator_1'),
  ('wallet:balance.label',        'en', 'Balance',          'approved', 'translator_1'),
  ('wallet:deposit.asset_label',  'en', 'Asset',            'approved', 'translator_1'),
  ('wallet:deposit.address_label','en', 'Address',          'approved', 'translator_1');

-- zh-Hant: wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',    'zh-Hant', '充值',                                    'approved', 'translator_2'),
  ('wallet:withdraw.title',   'zh-Hant', '提現',                                    'approved', 'translator_2'),
  ('wallet:withdraw.amount',  'zh-Hant', '提現金額：{amount, number}',                'approved', 'translator_2'),
  ('wallet:balance.display',  'zh-Hant', '可用：{balance, number, ::currency/USD}',   'approved', 'translator_2'),
  ('wallet:transfer.confirm', 'zh-Hant', '轉帳 {amount, number} {asset} 給 {recipient}？', 'approved', 'translator_2');

-- wallet compliance zh-Hant — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'zh-Hant', '繼續操作即表示您確認並同意我們用戶協議中所述之提現條款。', 'legal_approved', 'translator_2', 'legal_team'),
  ('wallet:earn.title',          'zh-Hant', '賺取', 'legal_approved', 'translator_2', 'legal_team');

INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:earn.holdings',        'zh-Hant', '我的持倉',   'approved', 'translator_2'),
  ('wallet:earn.total_profit',    'zh-Hant', '累計收益',   'approved', 'translator_2'),
  ('wallet:earn.last_day_profit', 'zh-Hant', '昨日收益',   'approved', 'translator_2'),
  ('wallet:balance.label',        'zh-Hant', '餘額',       'approved', 'translator_2'),
  ('wallet:deposit.asset_label',  'zh-Hant', '資產',       'approved', 'translator_2'),
  ('wallet:deposit.address_label','zh-Hant', '地址',       'approved', 'translator_2');

-- zh-Hans: 100% wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',        'zh-Hans', '充值',  'approved', 'translator_3'),
  ('wallet:withdraw.title',       'zh-Hans', '提现',  'approved', 'translator_3'),
  ('wallet:withdraw.amount',      'zh-Hans', '提现金额：{amount, number}', 'approved', 'translator_3'),
  ('wallet:balance.display',      'zh-Hans', '可用：{balance, number, ::currency/USD}', 'approved', 'translator_3'),
  ('wallet:transfer.confirm',     'zh-Hans', '转账 {amount, number} {asset} 给 {recipient}？', 'approved', 'translator_3'),
  ('wallet:earn.holdings',        'zh-Hans', '我的持仓',   'approved', 'translator_3'),
  ('wallet:earn.total_profit',    'zh-Hans', '累计收益',   'approved', 'translator_3'),
  ('wallet:earn.last_day_profit', 'zh-Hans', '昨日收益',   'approved', 'translator_3'),
  ('wallet:balance.label',        'zh-Hans', '余额',       'approved', 'translator_3'),
  ('wallet:deposit.asset_label',  'zh-Hans', '资产',       'approved', 'translator_3'),
  ('wallet:deposit.address_label','zh-Hans', '地址',       'approved', 'translator_3');

-- wallet compliance zh-Hans — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'zh-Hans', '继续操作即表示您确认并同意我们用户协议中所述之提现条款。', 'legal_approved', 'translator_3', 'legal_team'),
  ('wallet:earn.title',          'zh-Hans', '赚取', 'legal_approved', 'translator_3', 'legal_team');

-- ar: 100% wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',        'ar', 'إيداع',                                 'approved', 'translator_4'),
  ('wallet:withdraw.title',       'ar', 'سحب',                                  'approved', 'translator_4'),
  ('wallet:withdraw.amount',      'ar', 'مبلغ السحب: {amount, number}',           'approved', 'translator_4'),
  ('wallet:balance.display',      'ar', 'المتاح: {balance, number, ::currency/USD}', 'approved', 'translator_4'),
  ('wallet:transfer.confirm',     'ar', 'تحويل {amount, number} {asset} إلى {recipient}؟', 'approved', 'translator_4'),
  ('wallet:balance.label',        'ar', 'الرصيد',       'approved', 'translator_4'),
  ('wallet:deposit.asset_label',  'ar', 'الأصل',        'approved', 'translator_4'),
  ('wallet:deposit.address_label','ar', 'العنوان',       'approved', 'translator_4');

-- wallet compliance ar — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'ar', 'بالمتابعة، فإنك تقر وتوافق على شروط السحب الموضحة في اتفاقية المستخدم الخاصة بنا.', 'legal_approved', 'translator_4', 'legal_team'),
  ('wallet:earn.title',          'ar', 'اربح', 'legal_approved', 'translator_4', 'legal_team');

INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:earn.holdings',       'ar', 'ممتلكاتي',        'approved', 'translator_4'),
  ('wallet:earn.total_profit',   'ar', 'إجمالي الربح',    'approved', 'translator_4'),
  ('wallet:earn.last_day_profit','ar', 'ربح آخر يوم',     'approved', 'translator_4');

-- ko: 100% wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',        'ko', '입금',                                    'approved', 'translator_5'),
  ('wallet:withdraw.title',       'ko', '출금',                                    'approved', 'translator_5'),
  ('wallet:withdraw.amount',      'ko', '출금 금액: {amount, number}',              'approved', 'translator_5'),
  ('wallet:balance.display',      'ko', '사용 가능: {balance, number, ::currency/USD}', 'approved', 'translator_5'),
  ('wallet:transfer.confirm',     'ko', '{recipient}에게 {amount, number} {asset}을(를) 전송하시겠습니까?', 'approved', 'translator_5'),
  ('wallet:earn.holdings',        'ko', '내 보유',       'approved', 'translator_5'),
  ('wallet:earn.total_profit',    'ko', '총 수익',       'approved', 'translator_5'),
  ('wallet:earn.last_day_profit', 'ko', '전일 수익',     'approved', 'translator_5'),
  ('wallet:balance.label',        'ko', '잔고',          'approved', 'translator_5'),
  ('wallet:deposit.asset_label',  'ko', '자산',          'approved', 'translator_5'),
  ('wallet:deposit.address_label','ko', '주소',          'approved', 'translator_5');

-- ko: wallet compliance — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'ko', '진행하시면 사용자 계약에 명시된 출금 조건에 동의하는 것입니다.', 'legal_approved', 'translator_5', 'legal_team'),
  ('wallet:earn.title', 'ko', '수익', 'legal_approved', 'translator_5', 'legal_team');

-- ja: 100% wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',        'ja', '入金',                                    'approved', 'translator_6'),
  ('wallet:withdraw.title',       'ja', '出金',                                    'approved', 'translator_6'),
  ('wallet:withdraw.amount',      'ja', '出金額: {amount, number}',                'approved', 'translator_6'),
  ('wallet:balance.display',      'ja', '利用可能: {balance, number, ::currency/USD}', 'approved', 'translator_6'),
  ('wallet:transfer.confirm',     'ja', '{recipient} に {amount, number} {asset} を送金しますか？', 'approved', 'translator_6'),
  ('wallet:earn.holdings',        'ja', '保有資産',       'approved', 'translator_6'),
  ('wallet:earn.total_profit',    'ja', '累計利益',       'approved', 'translator_6'),
  ('wallet:earn.last_day_profit', 'ja', '前日利益',       'approved', 'translator_6'),
  ('wallet:balance.label',        'ja', '残高',           'approved', 'translator_6'),
  ('wallet:deposit.asset_label',  'ja', '資産',           'approved', 'translator_6'),
  ('wallet:deposit.address_label','ja', 'アドレス',       'approved', 'translator_6');

-- ja: wallet compliance — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'ja', '続行することにより、ユーザー契約に記載された出金条件に同意したものとみなされます。', 'legal_approved', 'translator_6', 'legal_team'),
  ('wallet:earn.title',          'ja', '運用', 'legal_approved', 'translator_6', 'legal_team');

-- es: 100% wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',        'es', 'Depósito',                                 'approved', 'translator_7'),
  ('wallet:withdraw.title',       'es', 'Retiro',                                   'approved', 'translator_7'),
  ('wallet:withdraw.amount',      'es', 'Monto de retiro: {amount, number}',         'approved', 'translator_7'),
  ('wallet:balance.display',      'es', 'Disponible: {balance, number, ::currency/USD}', 'approved', 'translator_7'),
  ('wallet:transfer.confirm',     'es', '¿Transferir {amount, number} {asset} a {recipient}?', 'approved', 'translator_7'),
  ('wallet:earn.holdings',        'es', 'Mis tenencias',   'approved', 'translator_7'),
  ('wallet:earn.total_profit',    'es', 'Beneficio total', 'approved', 'translator_7'),
  ('wallet:earn.last_day_profit', 'es', 'Beneficio último día', 'approved', 'translator_7'),
  ('wallet:balance.label',        'es', 'Saldo',           'approved', 'translator_7'),
  ('wallet:deposit.asset_label',  'es', 'Activo',          'approved', 'translator_7'),
  ('wallet:deposit.address_label','es', 'Dirección',       'approved', 'translator_7');

-- es: wallet compliance — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'es', 'Al continuar, usted reconoce y acepta los términos de retiro descritos en nuestro Acuerdo de usuario.', 'legal_approved', 'translator_7', 'legal_team'),
  ('wallet:earn.title',          'es', 'Ganar', 'legal_approved', 'translator_7', 'legal_team');

-- de: 100% wallet
INSERT INTO translations (key_id, locale, value, status, approved_by) VALUES
  ('wallet:deposit.title',        'de', 'Einzahlung',                                'approved', 'translator_8'),
  ('wallet:withdraw.title',       'de', 'Auszahlung',                                'approved', 'translator_8'),
  ('wallet:withdraw.amount',      'de', 'Auszahlungsbetrag: {amount, number}',        'approved', 'translator_8'),
  ('wallet:balance.display',      'de', 'Verfügbar: {balance, number, ::currency/USD}', 'approved', 'translator_8'),
  ('wallet:transfer.confirm',     'de', '{amount, number} {asset} an {recipient} überweisen?', 'approved', 'translator_8'),
  ('wallet:earn.holdings',        'de', 'Meine Bestände',    'approved', 'translator_8'),
  ('wallet:earn.total_profit',    'de', 'Gesamtgewinn',      'approved', 'translator_8'),
  ('wallet:earn.last_day_profit', 'de', 'Gewinn letzter Tag','approved', 'translator_8'),
  ('wallet:balance.label',        'de', 'Guthaben',          'approved', 'translator_8'),
  ('wallet:deposit.asset_label',  'de', 'Vermögenswert',     'approved', 'translator_8'),
  ('wallet:deposit.address_label','de', 'Adresse',           'approved', 'translator_8');

-- de: wallet compliance — legal_approved
INSERT INTO translations (key_id, locale, value, status, approved_by, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'de', 'Durch Fortfahren bestätigen Sie die in unserer Nutzungsvereinbarung dargelegten Auszahlungsbedingungen.', 'legal_approved', 'translator_8', 'legal_team'),
  ('wallet:earn.title',          'de', 'Verdienen', 'legal_approved', 'translator_8', 'legal_team');

-- ============================================================
-- REGION OVERRIDES
-- All compliance keys × all regions × all 8 base locales
-- ============================================================

-- ── trade:risk.warning — US ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('trade:risk.warning', 'en',      'US', 'Trading digital assets involves significant risk including potential total loss of invested capital. Digital assets are not legal tender and are not backed by any government. Past performance is not indicative of future results.', 'legal_team'),
  ('trade:risk.warning', 'zh-Hant', 'US', '數位資產交易涉及重大風險，包括可能完全損失投入資本。數位資產不是法定貨幣，也不受任何政府支持。過去的表現不代表未來的結果。', 'legal_team'),
  ('trade:risk.warning', 'zh-Hans', 'US', '数字资产交易涉及重大风险，包括可能完全损失投入资本。数字资产不是法定货币，也不受任何政府支持。过去的表现不代表未来的结果。', 'legal_team'),
  ('trade:risk.warning', 'ar',      'US', 'ينطوي تداول الأصول الرقمية على مخاطر كبيرة بما في ذلك الخسارة الكاملة المحتملة لرأس المال المستثمر. الأصول الرقمية ليست عملة قانونية ولا تدعمها أي حكومة. الأداء السابق لا يعد مؤشرًا على النتائج المستقبلية.', 'legal_team'),
  ('trade:risk.warning', 'ko',      'US', '디지털 자산 거래에는 투자 원금의 전액 손실 가능성을 포함한 상당한 위험이 수반됩니다. 디지털 자산은 법정 화폐가 아니며 어떠한 정부의 지원도 받지 않습니다. 과거 실적이 미래 결과를 보장하지 않습니다.', 'legal_team'),
  ('trade:risk.warning', 'ja',      'US', 'デジタル資産の取引には、投資元本の全額損失の可能性を含む重大なリスクが伴います。デジタル資産は法定通貨ではなく、いかなる政府の裏付けもありません。過去の実績は将来の結果を示すものではありません。', 'legal_team'),
  ('trade:risk.warning', 'es',      'US', 'La negociación de activos digitales implica un riesgo significativo, incluyendo la posible pérdida total del capital invertido. Los activos digitales no son moneda de curso legal y no están respaldados por ningún gobierno. El rendimiento pasado no es indicativo de resultados futuros.', 'legal_team'),
  ('trade:risk.warning', 'de',      'US', 'Der Handel mit digitalen Vermögenswerten birgt erhebliche Risiken, einschließlich des möglichen Totalverlusts des investierten Kapitals. Digitale Vermögenswerte sind kein gesetzliches Zahlungsmittel und werden von keiner Regierung unterstützt. Die bisherige Wertentwicklung ist kein Indikator für zukünftige Ergebnisse.', 'legal_team');

-- ── trade:risk.warning — MENA ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('trade:risk.warning', 'en',      'MENA', 'Trading digital assets involves significant risk including potential total loss of invested capital. Digital assets are not legal tender and are not backed by any government. Past performance is not indicative of future results.', 'legal_team'),
  ('trade:risk.warning', 'zh-Hant', 'MENA', '數位資產交易涉及重大風險，包括可能完全損失投入資本。數位資產不是法定貨幣，也不受任何政府支持。過去的表現不代表未來的結果。', 'legal_team'),
  ('trade:risk.warning', 'zh-Hans', 'MENA', '数字资产交易涉及重大风险，包括可能完全损失投入资本。数字资产不是法定货币，也不受任何政府支持。过去的表现不代表未来的结果。', 'legal_team'),
  ('trade:risk.warning', 'ar',      'MENA', 'ينطوي تداول الأصول الرقمية على مخاطر كبيرة بما في ذلك الخسارة الكاملة المحتملة لرأس المال المستثمر. الأصول الرقمية ليست عملة قانونية ولا تدعمها أي حكومة. الأداء السابق لا يعد مؤشرًا على النتائج المستقبلية.', 'legal_team'),
  ('trade:risk.warning', 'ko',      'MENA', '디지털 자산 거래에는 투자 원금의 전액 손실 가능성을 포함한 상당한 위험이 수반됩니다. 디지털 자산은 법정 화폐가 아니며 어떠한 정부의 지원도 받지 않습니다. 과거 실적이 미래 결과를 보장하지 않습니다.', 'legal_team'),
  ('trade:risk.warning', 'ja',      'MENA', 'デジタル資産の取引には、投資元本の全額損失の可能性を含む重大なリスクが伴います。デジタル資産は法定通貨ではなく、いかなる政府の裏付けもありません。過去の実績は将来の結果を示すものではありません。', 'legal_team'),
  ('trade:risk.warning', 'es',      'MENA', 'La negociación de activos digitales implica un riesgo significativo, incluyendo la posible pérdida total del capital invertido. Los activos digitales no son moneda de curso legal y no están respaldados por ningún gobierno. El rendimiento pasado no es indicativo de resultados futuros.', 'legal_team'),
  ('trade:risk.warning', 'de',      'MENA', 'Der Handel mit digitalen Vermögenswerten birgt erhebliche Risiken, einschließlich des möglichen Totalverlusts des investierten Kapitals. Digitale Vermögenswerte sind kein gesetzliches Zahlungsmittel und werden von keiner Regierung unterstützt. Die bisherige Wertentwicklung ist kein Indikator für zukünftige Ergebnisse.', 'legal_team');

-- ── wallet:withdraw.disclaimer — US ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'en',      'US', 'By proceeding, you acknowledge that this withdrawal is subject to United States financial regulations and you agree to the terms outlined in our User Agreement and US Regulatory Addendum.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hant', 'US', '繼續操作即表示您確認此提現受美國金融法規管轄，且您同意我們用戶協議及美國法規附錄中所述之條款。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hans', 'US', '继续操作即表示您确认此提现受美国金融法规管辖，且您同意我们用户协议及美国法规附录中所述之条款。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ar',      'US', 'بالمتابعة، فإنك تقر بأن عملية السحب هذه تخضع للوائح المالية الأمريكية، وتوافق على الشروط الموضحة في اتفاقية المستخدم والملحق التنظيمي الأمريكي.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ko',      'US', '진행하시면 본 출금이 미국 금융 규정의 적용을 받으며, 사용자 계약 및 미국 규정 부록에 명시된 조건에 동의하는 것입니다.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ja',      'US', '続行することにより、この出金が米国の金融規制の対象であることを確認し、ユーザー契約および米国規制付属書に記載された条件に同意したものとみなされます。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'es',      'US', 'Al continuar, usted reconoce que este retiro está sujeto a las regulaciones financieras de los Estados Unidos y acepta los términos descritos en nuestro Acuerdo de usuario y el Anexo regulatorio de EE. UU.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'de',      'US', 'Durch Fortfahren bestätigen Sie, dass diese Auszahlung den Finanzvorschriften der Vereinigten Staaten unterliegt, und stimmen den Bedingungen in unserer Nutzungsvereinbarung und dem US-Regulierungsanhang zu.', 'legal_team');

-- ── wallet:withdraw.disclaimer — EU ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'en',      'EU', 'By proceeding, you acknowledge that this withdrawal is subject to European Union financial regulations including MiCA, and you agree to the terms outlined in our User Agreement.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hant', 'EU', '繼續操作即表示您確認此提現受歐盟金融法規（包括 MiCA）管轄，且您同意我們用戶協議中所述之條款。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hans', 'EU', '继续操作即表示您确认此提现受欧盟金融法规（包括 MiCA）管辖，且您同意我们用户协议中所述之条款。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ar',      'EU', 'بالمتابعة، فإنك تقر بأن عملية السحب هذه تخضع للوائح المالية للاتحاد الأوروبي بما في ذلك MiCA، وتوافق على الشروط الموضحة في اتفاقية المستخدم الخاصة بنا.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ko',      'EU', '진행하시면 본 출금이 MiCA를 포함한 유럽연합 금융 규정의 적용을 받으며, 사용자 계약에 명시된 조건에 동의하는 것입니다.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ja',      'EU', '続行することにより、この出金がMiCAを含む欧州連合の金融規制の対象であることを確認し、ユーザー契約に記載された条件に同意したものとみなされます。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'es',      'EU', 'Al continuar, usted reconoce que este retiro está sujeto a las regulaciones financieras de la Unión Europea, incluida MiCA, y acepta los términos descritos en nuestro Acuerdo de usuario.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'de',      'EU', 'Durch Fortfahren bestätigen Sie, dass diese Auszahlung den Finanzvorschriften der Europäischen Union einschließlich MiCA unterliegt, und stimmen den in unserer Nutzungsvereinbarung dargelegten Bedingungen zu.', 'legal_team');

-- ── wallet:withdraw.disclaimer — MENA ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:withdraw.disclaimer', 'en',      'MENA', 'By proceeding, you acknowledge that this withdrawal is subject to applicable MENA financial regulations and you agree to the terms outlined in our User Agreement and Regional Regulatory Addendum.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hant', 'MENA', '繼續操作即表示您確認此提現受中東及北非地區適用金融法規管轄，且您同意我們用戶協議及區域法規附錄中所述之條款。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'zh-Hans', 'MENA', '继续操作即表示您确认此提现受中东及北非地区适用金融法规管辖，且您同意我们用户协议及区域法规附录中所述之条款。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ar',      'MENA', 'بالمتابعة، فإنك تقر بأن عملية السحب هذه تخضع للوائح المالية المعمول بها في منطقتك، وتوافق على الشروط الموضحة في اتفاقية المستخدم والملحق التنظيمي الإقليمي.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ko',      'MENA', '진행하시면 본 출금이 해당 MENA 금융 규정의 적용을 받으며, 사용자 계약 및 지역 규정 부록에 명시된 조건에 동의하는 것입니다.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'ja',      'MENA', '続行することにより、この出金がMENA地域の適用金融規制の対象であることを確認し、ユーザー契約および地域規制付属書に記載された条件に同意したものとみなされます。', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'es',      'MENA', 'Al continuar, usted reconoce que este retiro está sujeto a las regulaciones financieras aplicables de MENA y acepta los términos descritos en nuestro Acuerdo de usuario y el Anexo regulatorio regional.', 'legal_team'),
  ('wallet:withdraw.disclaimer', 'de',      'MENA', 'Durch Fortfahren bestätigen Sie, dass diese Auszahlung den geltenden MENA-Finanzvorschriften unterliegt, und stimmen den Bedingungen in unserer Nutzungsvereinbarung und dem regionalen Regulierungsanhang zu.', 'legal_team');

-- ── wallet:earn.title — US ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:earn.title', 'en',      'US', 'Rewards', 'legal_team'),
  ('wallet:earn.title', 'zh-Hant', 'US', '獎勵', 'legal_team'),
  ('wallet:earn.title', 'zh-Hans', 'US', '奖励', 'legal_team'),
  ('wallet:earn.title', 'ar',      'US', 'مكافآت', 'legal_team'),
  ('wallet:earn.title', 'ko',      'US', '리워드', 'legal_team'),
  ('wallet:earn.title', 'ja',      'US', 'リワード', 'legal_team'),
  ('wallet:earn.title', 'es',      'US', 'Recompensas', 'legal_team'),
  ('wallet:earn.title', 'de',      'US', 'Prämien', 'legal_team');

-- ── wallet:earn.title — MENA ──
INSERT INTO region_overrides (key_id, locale, region, value, legal_approved_by) VALUES
  ('wallet:earn.title', 'en',      'MENA', 'Rewards', 'legal_team'),
  ('wallet:earn.title', 'zh-Hant', 'MENA', '獎勵', 'legal_team'),
  ('wallet:earn.title', 'zh-Hans', 'MENA', '奖励', 'legal_team'),
  ('wallet:earn.title', 'ar',      'MENA', 'مكافآت', 'legal_team'),
  ('wallet:earn.title', 'ko',      'MENA', '리워드', 'legal_team'),
  ('wallet:earn.title', 'ja',      'MENA', 'リワード', 'legal_team'),
  ('wallet:earn.title', 'es',      'MENA', 'Recompensas', 'legal_team'),
  ('wallet:earn.title', 'de',      'MENA', 'Prämien', 'legal_team');
