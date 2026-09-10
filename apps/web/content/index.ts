import type { Locale } from '@klyrow/contracts'
import { englishPages } from './en'
import { spanishPages } from './es'
import type { MarketingPageContent } from './schema'

export { englishPages, spanishPages }
export type { MarketingPageContent } from './schema'

const catalog: Record<Locale, MarketingPageContent[]> = {
  en: englishPages,
  es: spanishPages
}

const normalizeContentPath = (path: string) => {
  const raw = String(path || '/').split(/[?#]/, 1)[0] || '/'
  const absolute = raw.startsWith('/') ? raw : `/${raw}`
  return absolute.length > 1 ? absolute.replace(/\/+$/, '') : '/'
}

export const localeFromRoutePath = (path: string): Locale => {
  const normalized = normalizeContentPath(path)
  return normalized === '/es' || normalized.startsWith('/es/') ? 'es' : 'en'
}

export const englishContentPathFromRoute = (path: string) => {
  const normalized = normalizeContentPath(path)
  if (normalized === '/es') return '/'
  if (normalized.startsWith('/es/')) return normalized.slice(3) || '/'
  return normalized
}

export const getMarketingPage = (locale: Locale, path: string) =>
  catalog[locale].find((page) => page.path === englishContentPathFromRoute(path))

export const getMarketingPages = (locale: Locale) => catalog[locale]

export const localizedContentPath = (locale: Locale, path: string) => {
  const canonical = englishContentPathFromRoute(path)
  return locale === 'es' ? (canonical === '/' ? '/es' : `/es${canonical}`) : canonical
}

export const resolveMarketingCtaTarget = (
  locale: Locale,
  currentPath: string,
  target: string,
  formId: string | undefined,
  externalContact: string
) => {
  const current = localizedContentPath(locale, currentPath)
  const destination = localizedContentPath(locale, target)
  if (destination !== current) return destination
  return formId ? externalContact : undefined
}

export const routeManifest = catalog.en.map((page) => ({
  path: page.path,
  esPath: localizedContentPath('es', page.path),
  id: page.id
}))
