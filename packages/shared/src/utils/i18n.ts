export const SUPPORTED_LANGS = ['en', 'zh'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export function isLang(lang: string): lang is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang);
}

/**
 * Read i18n json like: { en: '...', zh: '...' }
 */
export function getI18nText(
  i18n: Record<string, string> | null | undefined,
  lang: string,
  fallbackLang = 'en',
): string {
  if (!i18n) return '';
  return i18n[lang] || i18n[fallbackLang] || Object.values(i18n)[0] || '';
}
