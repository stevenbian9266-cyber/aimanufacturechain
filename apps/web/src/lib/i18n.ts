import { SUPPORTED_LANGS, isLang, type Lang } from '@mfg/shared';

export { SUPPORTED_LANGS, isLang };
export type { Lang };

export function normalizeLang(input: string): Lang {
  return isLang(input) ? input : 'en';
}
