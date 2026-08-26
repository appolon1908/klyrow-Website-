import type { Locale } from '@klyrow/contracts'
import { getMarketingPages } from '../../content'
import { pricingPlans } from '../../content/pricing'
import { getLegalDocumentBySlug, getLegalDocuments } from '../../legal'

export const getPublicNavigation = (locale: Locale) => {
  const label = (en: string, es: string) => (locale === 'es' ? es : en)
  return [
    { id: 'product', label: label('Product', 'Producto'), path: locale === 'es' ? '/es/platform' : '/platform' },
    { id: 'solutions', label: label('Solutions', 'Soluciones'), path: locale === 'es' ? '/es/solutions/developers' : '/solutions/developers' },
    { id: 'integrations', label: label('Integrations', 'Integraciones'), path: locale === 'es' ? '/es/integrations' : '/integrations' },
    { id: 'developers', label: label('Developers', 'Desarrolladores'), path: locale === 'es' ? '/es/developers' : '/developers' },
    { id: 'pricing', label: label('Pricing', 'Precios'), path: locale === 'es' ? '/es/pricing' : '/pricing' },
  ]
}

export const getPublicFeatures = (locale: Locale) => getMarketingPages(locale).filter((page) => page.kind === 'feature').map(({ id, path, title, summary }) => ({ id, path: locale === 'es' ? `/es${path}` : path, title, summary }))
export const getPublicPricing = (locale: Locale, mode: string) => ({ mode, plans: pricingPlans.map((plan) => ({ id: plan.id, name: plan.name[locale], summary: plan.summary[locale], audience: plan.audience[locale], features: plan.features.map((item) => item[locale]), featured: Boolean(plan.featured) })) })
export const getPublicLegalDocuments = (locale: Locale) => getLegalDocuments(locale).map(({ id, slug, title, summary, version, status, lastUpdated, canonicalPath, indexable, owner }) => ({ id, slug, title, summary, version, status, last_updated: lastUpdated, canonical_path: canonicalPath, indexable, owner }))
export const getPublicLegalDocument = (locale: Locale, slug: string) => {
  const document = getLegalDocumentBySlug(locale, slug)
  if (!document) return undefined
  return {
    id: document.id, slug: document.slug, title: document.title, summary: document.summary,
    version: document.version, status: document.status, last_updated: document.lastUpdated,
    canonical_path: document.canonicalPath, indexable: document.indexable,
    sections: document.sections,
  }
}
