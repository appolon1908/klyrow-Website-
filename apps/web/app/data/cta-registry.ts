import type { CtaDefinition } from '@klyrow/contracts'

export interface RegisteredCta {
  definition: CtaDefinition
  labels: { en: string; es: string }
  fallbackRoute?: string
}

const cta = (
  id: string,
  labels: RegisteredCta['labels'],
  kind: CtaDefinition['kind'],
  target: string,
  variant: CtaDefinition['variant'] = 'primary',
  fallbackRoute?: string,
): RegisteredCta => ({
  definition: { id, labelKey: id, kind, target, analyticsEvent: id.includes('pricing') ? 'pricing_cta_click' : 'cta_click', variant },
  labels,
  fallbackRoute,
})

export const ctaRegistry = {
  'nav-sign-in': cta('nav-sign-in', { en: 'Sign in', es: 'Iniciar sesión' }, 'auth', 'runtime:signInUrl', 'text', '/developers'),
  'nav-start-building': cta('nav-start-building', { en: 'Start building', es: 'Comenzar a crear' }, 'route', '/developers'),
  'nav-request-demo': cta('nav-request-demo', { en: 'Request a demo', es: 'Solicitar una demostración' }, 'form', 'request-demo'),
  'hero-start-building': cta('hero-start-building', { en: 'Start building', es: 'Comenzar a crear' }, 'route', '/developers'),
  'hero-request-demo': cta('hero-request-demo', { en: 'Request a demo', es: 'Solicitar una demostración' }, 'form', 'request-demo', 'secondary'),
  'pricing-contact-sales': cta('pricing-contact-sales', { en: 'Talk to sales', es: 'Hablar con ventas' }, 'form', 'contact-sales'),
  'pricing-request-consultation': cta('pricing-request-consultation', { en: 'Request pricing consultation', es: 'Solicitar consulta de precios' }, 'form', 'pricing-consultation'),
  'developer-open-docs': cta('developer-open-docs', { en: 'Open documentation', es: 'Abrir documentación' }, 'external', 'runtime:docsUrl', 'secondary', '/developers/api'),
  'developer-api-interest': cta('developer-api-interest', { en: 'Request API access', es: 'Solicitar acceso a la API' }, 'form', 'developer-interest'),
  'partner-apply': cta('partner-apply', { en: 'Apply as a partner', es: 'Solicitar alianza' }, 'form', 'partner-application'),
  'enterprise-contact': cta('enterprise-contact', { en: 'Talk to enterprise sales', es: 'Hablar con ventas empresariales' }, 'form', 'contact-sales'),
  'odoo-automation-consultation': cta('odoo-automation-consultation', { en: 'Plan an integration', es: 'Planificar una integración' }, 'form', 'migration-consultation'),
  'migration-consultation': cta('migration-consultation', { en: 'Plan a migration', es: 'Planificar una migración' }, 'form', 'migration-consultation'),
  'newsletter-subscribe': cta('newsletter-subscribe', { en: 'Subscribe', es: 'Suscribirse' }, 'form', 'newsletter'),
  'support-contact': cta('support-contact', { en: 'Contact support', es: 'Contactar soporte' }, 'form', 'support-contact'),
  'popup-request-demo': cta('popup-request-demo', { en: 'See Klyrow in context', es: 'Ver Klyrow en contexto' }, 'form', 'request-demo'),
  'footer-contact-sales': cta('footer-contact-sales', { en: 'Contact sales', es: 'Contactar ventas' }, 'form', 'contact-sales'),
  'footer-status': cta('footer-status', { en: 'Service status', es: 'Estado del servicio' }, 'external', 'runtime:statusUrl', 'text', '/platform'),
} as const satisfies Record<string, RegisteredCta>

export type CtaId = keyof typeof ctaRegistry

export const formRouteMap: Record<string, string> = {
  'request-demo': '/demo',
  'contact-sales': '/contact',
  'pricing-consultation': '/pricing',
  'developer-interest': '/developers',
  'partner-application': '/solutions/agencies-resellers',
  'migration-consultation': '/solutions/odoo-automation',
  newsletter: '/resources',
  'support-contact': '/contact',
}
