export { authAr } from './ar';
export { authEn } from './en';

import { authAr } from './ar';
import { authEn } from './en';

export type AuthTranslations = typeof authAr;

export function getAuthTranslations(locale: string): AuthTranslations {
  return locale === 'ar' ? authAr : (authEn as unknown as AuthTranslations);
}
