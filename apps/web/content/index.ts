import type { Locale } from '@klyrow/contracts'
import { englishPages } from './en'
import { spanishPages } from './es'
import type { MarketingPageContent } from './schema'

export { englishPages, spanishPages }
export type { MarketingPageContent, MarketingPageKind } from './schema'

const catalog: Record<Locale, MarketingPageContent[]> = { en: englishPages, es: spanishPages }

export const getMarketingPage = (locale: Locale, path: string) => catalog[locale].find((page) => page.path === path)
export const getMarketingPages = (locale: Locale) => catalog[locale]
export const localizedContentPath = (locale: Locale, path: string) => (locale === 'es' ? (path === '/' ? '/es' : `/es${path}`) : path)
export const routeManifest = catalog.en.map((page) => ({ path: page.path, esPath: localizedContentPath('es', page.path), id: page.id }))
