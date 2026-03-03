'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { I18nClient } from './client';
import type { Manifest, LocaleConfig } from './types';

// --- Context ---

interface I18nContextValue {
  client: I18nClient;
  manifest: Manifest | null;
  locale: string;
  region: string;
  setLocale: (locale: string) => void;
  setRegion: (region: string) => void;
  isReady: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// --- Provider ---

interface I18nProviderProps {
  children: ReactNode;
  locale: string;
  region?: string;
  initialNamespaces?: string[];
}

export function I18nProvider({
  children,
  locale: initialLocale,
  region: initialRegion = '',
  initialNamespaces = ['common'],
}: I18nProviderProps) {
  const clientRef = useRef<I18nClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = new I18nClient();
  }
  const client = clientRef.current;

  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [locale, setLocaleState] = useState(initialLocale);
  const [region, setRegionState] = useState(initialRegion);
  const [isReady, setIsReady] = useState(false);
  const initializedRef = useRef(false);

  // Initialize: fetch manifest + preload initial namespaces
  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setIsReady(false);
      const m = await client.init();
      if (cancelled) return;
      setManifest(m);

      // Preload initial namespaces for current locale + fallback chain
      await client.preloadLocale(locale, initialNamespaces, region || undefined);
      if (cancelled) return;
      initializedRef.current = true;
      setIsReady(true);
    }

    initialize();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When locale or region changes AFTER init, reload namespaces
  useEffect(() => {
    // Skip the first run triggered by manifest being set — init effect handles that
    if (!manifest || !initializedRef.current) return;
    let cancelled = false;

    async function reload() {
      setIsReady(false);
      // Reload all namespaces that were initially requested
      await client.preloadLocale(locale, initialNamespaces, region || undefined);
      if (cancelled) return;
      setIsReady(true);
    }

    reload();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, region]);

  // Set document dir and lang from manifest metadata
  useEffect(() => {
    if (!manifest) return;
    const dir = manifest.locales[locale]?.direction ?? 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, manifest]);

  const setLocale = useCallback((newLocale: string) => {
    document.cookie = `i18n-locale=${newLocale};path=/;max-age=31536000`;
    setLocaleState(newLocale);
  }, []);

  const setRegion = useCallback((newRegion: string) => {
    document.cookie = `i18n-region=${newRegion};path=/;max-age=31536000`;
    setRegionState(newRegion);
  }, []);

  return (
    <I18nContext.Provider
      value={{ client, manifest, locale, region, setLocale, setRegion, isReady }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// --- Hooks ---

function useI18nContext(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>');
  return ctx;
}

export function useTranslation(namespace: string) {
  const { client, locale, region, isReady } = useI18nContext();

  // Track which locale|region|namespace combo has been loaded.
  // A plain boolean `nsReady` goes stale when locale changes: the reload effect
  // sets isReady=false then true, but the useEffect here may skip (early return
  // when !isReady) without resetting nsReady — leaving a render frame where
  // isLoading=false but bundles for the NEW locale aren't loaded yet.
  const loadKey = `${locale}|${region}|${namespace}`;
  const [readyKey, setReadyKey] = useState('');

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    async function load() {
      await client.preloadLocale(locale, [namespace], region || undefined);
      if (!cancelled) setReadyKey(`${locale}|${region}|${namespace}`);
    }

    load();
    return () => { cancelled = true; };
  }, [client, locale, region, namespace, isReady]);

  const t = useCallback(
    (key: string, values?: Record<string, unknown>): string => {
      const fullKey = `${namespace}:${key}`;
      return client.t(fullKey, locale, values, region || undefined);
    },
    [client, locale, region, namespace]
  );

  return { t, isLoading: !isReady || readyKey !== loadKey };
}

export function useLocale() {
  const { manifest, locale, region, setLocale, setRegion } = useI18nContext();

  const direction = manifest?.locales[locale]?.direction ?? 'ltr';

  const locales: { locale: string; config: LocaleConfig }[] = manifest
    ? Object.entries(manifest.locales).map(([loc, config]) => ({ locale: loc, config }))
    : [];

  return { locale, region, setLocale, setRegion, direction, locales };
}
