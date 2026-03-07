import IntlMessageFormat from 'intl-messageformat';
import type { Manifest, LocaleConfig } from './types';

type Bundle = Record<string, string>;

export class I18nClient {
  private manifest: Manifest | null = null;
  private bundleCache = new Map<string, Bundle>();
  private overrideCache = new Map<string, Bundle>();
  private formatCache = new Map<string, IntlMessageFormat>();
  private loadingPromises = new Map<string, Promise<void>>();
  private resolvedLocaleCache = new Map<string, string>();
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  // Best-match a (possibly maximized) BCP 47 tag against manifest locales.
  // e.g. "ko-Kore-KR" → "ko", "zh-Hant-TW" → "zh-Hant-TW"
  //
  // Resolution: exact → lang-Script-Region → lang-Script → lang → default
  // Uses Intl.Locale to decompose; no hardcoded locale list needed.
  resolveLocale(raw: string): string {
    if (!this.manifest) return raw;

    const cached = this.resolvedLocaleCache.get(raw);
    if (cached) return cached;

    const known = this.manifest.locales;
    if (known[raw]) return this._cacheResolved(raw, raw);

    try {
      const loc = new Intl.Locale(raw);
      const { language, script, region } = loc;

      // Try progressively shorter tags
      const candidates: string[] = [];
      if (script && region) candidates.push(`${language}-${script}-${region}`);
      if (script) candidates.push(`${language}-${script}`);
      if (region) candidates.push(`${language}-${region}`);
      candidates.push(language);

      for (const c of candidates) {
        if (known[c]) return this._cacheResolved(raw, c);
      }
    } catch {
      // malformed tag — fall through
    }

    return this._cacheResolved(raw, this.manifest.default_locale);
  }

  private _cacheResolved(raw: string, resolved: string): string {
    this.resolvedLocaleCache.set(raw, resolved);
    return resolved;
  }

  // Fetch manifest from API
  async init(): Promise<Manifest> {
    const res = await fetch(`${this.baseUrl}/api/i18n/manifest`);
    if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);
    this.manifest = await res.json();
    return this.manifest!;
  }

  getManifest(): Manifest {
    if (!this.manifest) throw new Error('I18nClient not initialized — call init() first');
    return this.manifest;
  }

  getDirection(locale: string): 'ltr' | 'rtl' {
    const resolved = this.manifest ? this.resolveLocale(locale) : locale;
    const config = this.manifest?.locales[resolved];
    return config?.direction ?? 'ltr';
  }

  getLocales(): { locale: string; config: LocaleConfig }[] {
    if (!this.manifest) return [];
    return Object.entries(this.manifest.locales).map(([locale, config]) => ({
      locale,
      config,
    }));
  }

  // Load a namespace for a locale (with dedup and caching)
  async loadNamespace(locale: string, namespace: string): Promise<void> {
    const version = this.manifest?.version;
    if (!version) throw new Error('I18nClient not initialized');

    const cacheKey = `${version}|${locale}|${namespace}`;

    if (this.bundleCache.has(cacheKey)) {
      console.log(`[i18n] Cache hit: ${namespace} for ${locale}`);
      return;
    }

    // Dedup concurrent loads for the same bundle
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const promise = this._fetchBundle(locale, namespace, cacheKey);
    this.loadingPromises.set(cacheKey, promise);

    try {
      await promise;
    } catch (err) {
      console.error(`[i18n] Failed to load ${namespace} for ${locale}:`, err);
      // Store empty bundle so we don't retry endlessly
      this.bundleCache.set(cacheKey, {});
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async _fetchBundle(locale: string, namespace: string, cacheKey: string): Promise<void> {
    const version = this.manifest!.version;
    console.log(`[i18n] Loading namespace: ${namespace} for locale: ${locale}`);

    const res = await fetch(
      `${this.baseUrl}/api/i18n/bundles/${version}/${locale}/${namespace}`
    );

    if (res.ok) {
      const bundle: Bundle = await res.json();
      this.bundleCache.set(cacheKey, bundle);
    } else {
      // Store empty bundle so we don't retry
      this.bundleCache.set(cacheKey, {});
    }
  }

  // Load region override bundle
  async loadOverrides(locale: string, namespace: string, region: string): Promise<void> {
    if (!region) return;

    const version = this.manifest?.version;
    if (!version) return;

    const cacheKey = `${version}|${locale}|${namespace}|${region}`;

    if (this.overrideCache.has(cacheKey)) {
      return;
    }

    console.log(`[i18n] Loading overrides: ${namespace} for ${locale}/${region}`);

    const res = await fetch(
      `${this.baseUrl}/api/i18n/bundles/${version}/${locale}/${namespace}/${region}`
    );

    if (res.ok) {
      const bundle: Bundle = await res.json();
      this.overrideCache.set(cacheKey, bundle);
    } else {
      // 404 = no overrides for this region, silently continue
      this.overrideCache.set(cacheKey, {});
    }
  }

  // Resolve a translation key with fallback chain + region overrides + ICU formatting
  t(
    fullKey: string,
    locale: string,
    values?: Record<string, unknown>,
    region?: string
  ): string {
    if (!this.manifest) return fullKey;

    // Parse "namespace:key" format
    const colonIdx = fullKey.indexOf(':');
    if (colonIdx === -1) return fullKey;

    const namespace = fullKey.substring(0, colonIdx);
    const key = fullKey.substring(colonIdx + 1);

    // Best-match locale against manifest, then resolve through fallback chain
    const matchedLocale = this.resolveLocale(locale);
    const resolved = this._resolve(key, namespace, matchedLocale, region);
    if (resolved === null) {
      return fullKey; // Return raw key ID — never empty string
    }

    // Format with ICU MessageFormat (use matched locale for correct plural rules)
    if (values && Object.keys(values).length > 0) {
      return this._format(resolved, matchedLocale, values);
    }

    return resolved;
  }

  private _resolve(
    key: string,
    namespace: string,
    locale: string,
    region?: string
  ): string | null {
    const version = this.manifest!.version;

    // Check region override first (overrides win on conflict)
    if (region) {
      const overrideKey = `${version}|${locale}|${namespace}|${region}`;
      const overrideBundle = this.overrideCache.get(overrideKey);
      if (overrideBundle?.[key] !== undefined) {
        return overrideBundle[key];
      }
    }

    // Check base bundle for this locale
    const cacheKey = `${version}|${locale}|${namespace}`;
    const bundle = this.bundleCache.get(cacheKey);
    if (bundle?.[key] !== undefined) {
      return bundle[key];
    }

    // Walk fallback chain
    const localeConfig = this.manifest!.locales[locale];
    const chain = localeConfig?.fallback_chain ?? ['en'];

    for (const fallbackLocale of chain) {
      // Check region override in fallback locale
      if (region) {
        const fbOverrideKey = `${version}|${fallbackLocale}|${namespace}|${region}`;
        const fbOverride = this.overrideCache.get(fbOverrideKey);
        if (fbOverride?.[key] !== undefined) {
          return fbOverride[key];
        }
      }

      // Check base bundle in fallback locale
      const fbKey = `${version}|${fallbackLocale}|${namespace}`;
      const fbBundle = this.bundleCache.get(fbKey);
      if (fbBundle?.[key] !== undefined) {
        return fbBundle[key];
      }
    }

    return null; // Chain exhausted
  }

  private _format(
    value: string,
    locale: string,
    values: Record<string, unknown>
  ): string {
    const formatKey = `${locale}|${value}`;

    let formatter = this.formatCache.get(formatKey);
    if (!formatter) {
      try {
        formatter = new IntlMessageFormat(value, locale);
        this.formatCache.set(formatKey, formatter);
      } catch {
        // If ICU parsing fails at runtime, return the raw value
        return value;
      }
    }

    try {
      return formatter.format(values) as string;
    } catch {
      return value;
    }
  }

  // Preload all namespaces for a locale (+ fallback chain), with optional region overrides
  async preloadLocale(locale: string, namespaces: string[], region?: string): Promise<void> {
    const resolved = this.manifest ? this.resolveLocale(locale) : locale;
    const localeConfig = this.manifest?.locales[resolved];
    const chain = localeConfig?.fallback_chain ?? ['en'];
    const allLocales = [resolved, ...chain];

    const promises: Promise<void>[] = [];

    for (const l of allLocales) {
      const localeNs = this.manifest?.locales[l]?.namespaces;
      for (const ns of namespaces) {
        // Skip if manifest says this locale has no bundle for this namespace
        if (localeNs && !localeNs.includes(ns)) continue;
        promises.push(this.loadNamespace(l, ns));
        if (region) {
          promises.push(this.loadOverrides(l, ns, region));
        }
      }
    }

    await Promise.all(promises);
  }
}
