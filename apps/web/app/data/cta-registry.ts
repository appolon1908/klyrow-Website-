import type { CtaDefinition, Locale } from '@klyrow/contracts'
import { localizedContentPath } from '../../content'

export interface RegisteredCta {
  definition: CtaDefinition
  labels: Record<Locale, string>
  fallbackRoute?: string
}

export interface CtaRuntimeValues {
  applicationLoginUrl?: string
  applicationSignupUrl?: string
  contactUrl?: string
  docsUrl?: string
  schedulingUrl?: string
  statusUrl?: string
}

export interface ResolvedRegisteredCta {
  disabled: boolean
  external: boolean
  href: string | undefined
  id: CtaId
  label: string
  variant: CtaDefinition['variant']
}

const defineCta = (
  id: string,
  labels: RegisteredCta['labels'],
  kind: CtaDefinition['kind'],
  target: string,
  variant: CtaDefinition['variant'] = 'primary',
  fallbackRoute?: string,
  allowedHosts?: string[]
): RegisteredCta => ({
  definition: {
    id,
    labelKey: id,
    kind,
    target,
    analyticsEvent: id.includes('pricing') ? 'pricing_cta_click' : 'cta_click',
    variant,
    ...(allowedHosts ? { allowedHosts } : {})
  },
  labels,
  ...(fallbackRoute ? { fallbackRoute } : {})
})

export const ctaRegistry = {
  'nav-sign-in': defineCta(
    'nav-sign-in',
    { en: 'Sign in', es: 'Iniciar sesión' },
    'auth',
    'runtime:applicationLoginUrl',
    'text',
    '/developers',
    ['app.klyrow.com']
  ),
  'nav-create-account': defineCta(
    'nav-create-account',
    { en: 'Create account', es: 'Crear cuenta' },
    'auth',
    'runtime:applicationSignupUrl',
    'primary',
    '/contact',
    ['app.klyrow.com']
  ),
  'nav-start-building': defineCta(
    'nav-start-building',
    { en: 'Start building', es: 'Comenzar a crear' },
    'route',
    '/developers'
  ),
  'nav-request-demo': defineCta(
    'nav-request-demo',
    { en: 'Request a demo', es: 'Solicitar una demostración' },
    'form',
    'request-demo'
  ),
  'hero-start-building': defineCta(
    'hero-start-building',
    { en: 'Start building', es: 'Comenzar a crear' },
    'route',
    '/developers'
  ),
  'hero-request-demo': defineCta(
    'hero-request-demo',
    { en: 'Request a demo', es: 'Solicitar una demostración' },
    'form',
    'request-demo',
    'secondary'
  ),
  'pricing-contact-sales': defineCta(
    'pricing-contact-sales',
    { en: 'Talk to sales', es: 'Hablar con ventas' },
    'form',
    'contact-sales'
  ),
  'pricing-request-consultation': defineCta(
    'pricing-request-consultation',
    { en: 'Request pricing consultation', es: 'Solicitar consulta de precios' },
    'form',
    'pricing-consultation'
  ),
  'developer-open-docs': defineCta(
    'developer-open-docs',
    { en: 'Open documentation', es: 'Abrir documentación' },
    'external',
    'runtime:docsUrl',
    'secondary',
    '/developers/api',
    ['docs.klyrow.com', 'developers.klyrow.com']
  ),
  'developer-api-interest': defineCta(
    'developer-api-interest',
    { en: 'Request API access', es: 'Solicitar acceso a la API' },
    'form',
    'developer-interest'
  ),
  'partner-apply': defineCta(
    'partner-apply',
    { en: 'Apply as a partner', es: 'Solicitar alianza' },
    'form',
    'partner-application'
  ),
  'enterprise-contact': defineCta(
    'enterprise-contact',
    { en: 'Talk to enterprise sales', es: 'Hablar con ventas empresariales' },
    'form',
    'contact-sales'
  ),
  'odoo-automation-consultation': defineCta(
    'odoo-automation-consultation',
    { en: 'Plan an integration', es: 'Planificar una integración' },
    'form',
    'migration-consultation'
  ),
  'migration-consultation': defineCta(
    'migration-consultation',
    { en: 'Plan a migration', es: 'Planificar una migración' },
    'form',
    'migration-consultation'
  ),
  'newsletter-subscribe': defineCta(
    'newsletter-subscribe',
    { en: 'Subscribe', es: 'Suscribirse' },
    'form',
    'newsletter'
  ),
  'support-contact': defineCta(
    'support-contact',
    { en: 'Contact support', es: 'Contactar soporte' },
    'form',
    'support-contact'
  ),
  'popup-request-demo': defineCta(
    'popup-request-demo',
    { en: 'See Klyrow in context', es: 'Ver Klyrow en contexto' },
    'form',
    'request-demo'
  ),
  'footer-contact-sales': defineCta(
    'footer-contact-sales',
    { en: 'Contact sales', es: 'Contactar ventas' },
    'form',
    'contact-sales'
  ),
  'footer-status': defineCta(
    'footer-status',
    { en: 'Service status', es: 'Estado del servicio' },
    'external',
    'runtime:statusUrl',
    'text',
    '/platform',
    ['status.klyrow.com']
  ),
  'schedule-consultation': defineCta(
    'schedule-consultation',
    { en: 'Schedule a consultation', es: 'Programar una consulta' },
    'external',
    'runtime:schedulingUrl',
    'secondary',
    '/contact',
    ['cal.com', 'calendly.com', 'codestra.co', 'www.codestra.co']
  )
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
  'support-contact': '/contact'
}

const runtimeTarget = (target: string, runtime: CtaRuntimeValues) => {
  if (!target.startsWith('runtime:')) return target
  const key = target.slice('runtime:'.length) as keyof CtaRuntimeValues
  return String(runtime[key] ?? '').trim()
}

const safeHttpsUrl = (candidate: string, allowedHosts: readonly string[] = []) => {
  if (!candidate) return undefined
  try {
    const url = new URL(candidate)
    const hostname = url.hostname.toLowerCase()
    if (url.protocol !== 'https:' || url.username || url.password) return undefined
    if (allowedHosts.length > 0 && !allowedHosts.includes(hostname)) return undefined
    return url
  } catch {
    return undefined
  }
}

export const resolveRegisteredCta = (
  id: CtaId,
  options: {
    currentPath: string
    locale: Locale
    runtime: CtaRuntimeValues
  }
): ResolvedRegisteredCta => {
  const registered = ctaRegistry[id]
  const { definition } = registered
  const localizedCurrent = localizedContentPath(options.locale, options.currentPath)
  const fallback = registered.fallbackRoute
    ? localizedContentPath(options.locale, registered.fallbackRoute)
    : undefined

  if (definition.kind === 'route') {
    const href = localizedContentPath(options.locale, definition.target)
    return {
      disabled: href === localizedCurrent,
      external: false,
      href: href === localizedCurrent ? undefined : href,
      id,
      label: registered.labels[options.locale],
      variant: definition.variant
    }
  }

  if (definition.kind === 'form') {
    const contact = safeHttpsUrl(String(options.runtime.contactUrl ?? ''), [
      'codestra.co',
      'www.codestra.co'
    ])
    if (contact) {
      contact.searchParams.set('form', definition.target)
      contact.searchParams.set('locale', options.locale)
      contact.searchParams.set('source', localizedCurrent)
      return {
        disabled: false,
        external: true,
        href: contact.toString(),
        id,
        label: registered.labels[options.locale],
        variant: definition.variant
      }
    }

    const localFormRoute = localizedContentPath(
      options.locale,
      formRouteMap[definition.target] ?? '/contact'
    )
    return {
      disabled: localFormRoute === localizedCurrent,
      external: false,
      href: localFormRoute === localizedCurrent ? undefined : localFormRoute,
      id,
      label: registered.labels[options.locale],
      variant: definition.variant
    }
  }

  const external = safeHttpsUrl(
    runtimeTarget(definition.target, options.runtime),
    definition.allowedHosts ?? []
  )
  return {
    disabled: !external && !fallback,
    external: Boolean(external),
    href: external?.toString() ?? fallback,
    id,
    label: registered.labels[options.locale],
    variant: definition.variant
  }
}
