export interface LocaleConfig {
  direction: 'ltr' | 'rtl';
  display_name: string;
  english_name: string;
  script: string;
  namespaces: string[];
  fallback_chain: string[];
}

export interface Manifest {
  version: number;
  timestamp: string;
  locales: Record<string, LocaleConfig>;
  namespaces: string[];
  default_locale: string;
}
