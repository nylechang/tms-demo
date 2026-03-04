import { NextRequest, NextResponse } from 'next/server';

// BCP 47 normalization: browsers often omit the Script subtag (e.g. "zh-TW"
// instead of "zh-Hant-TW"). Intl.Locale.maximize() uses Unicode CLDR
// likely-subtags data to fill in the missing subtag.
// The SDK then does best-match against manifest locales, so we don't need
// a hardcoded list here — just pass through the maximized tag.
function normalizeLocale(raw: string): string {
  try {
    return new Intl.Locale(raw).maximize().toString();
  } catch {
    return raw; // malformed tag — pass through, SDK will fall back to 'en'
  }
}

// Locale detection priority: URL param → Cookie → Accept-Language → 'en'
export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // 1. URL param ?locale=xx
  let locale = searchParams.get('locale');
  let source = locale ? 'url' : '';

  // 2. Cookie (already normalized when we set it — skip normalize)
  if (!locale) {
    locale = request.cookies.get('i18n-locale')?.value ?? null;
    source = locale ? 'cookie' : '';
  }

  // 3. Accept-Language header
  if (!locale) {
    const acceptLang = request.headers.get('accept-language');
    if (acceptLang) {
      // Parse first preferred language (e.g., "ar-SA,ar;q=0.9,en;q=0.8" → "ar-SA")
      const preferred = acceptLang.split(',')[0]?.split(';')[0]?.trim();
      if (preferred) {
        locale = normalizeLocale(preferred);
        source = 'accept-language';
      }
    }
  }

  // 4. Default
  if (!locale) {
    locale = 'en';
    source = 'default';
  }

  // Normalize URL param source too (user might type ?locale=zh-TW)
  if (source === 'url') {
    locale = normalizeLocale(locale);
  }

  // Read region from cookie (no auto-detection — only set by client-side region selector)
  const region = request.cookies.get('i18n-region')?.value ?? '';

  const response = NextResponse.next();

  // Pass to app via headers so server components can read them
  response.headers.set('x-i18n-locale', locale);
  response.headers.set('x-i18n-region', region);

  // Set cookie if locale was detected from URL param or Accept-Language (not already in cookie)
  if (source === 'url' || source === 'accept-language') {
    response.cookies.set('i18n-locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except API routes, _next, and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
