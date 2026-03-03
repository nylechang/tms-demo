import { NextRequest, NextResponse } from 'next/server';

// Locale detection priority: URL param → Cookie → Accept-Language → 'en'
export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // 1. URL param ?locale=xx
  let locale = searchParams.get('locale');
  let source = locale ? 'url' : '';

  // 2. Cookie
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
        locale = preferred;
        source = 'accept-language';
      }
    }
  }

  // 4. Default
  if (!locale) {
    locale = 'en';
    source = 'default';
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
