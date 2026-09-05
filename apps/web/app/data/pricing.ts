import type { Locale } from '@klyrow/contracts'

export interface LocalizedText {
  en: string
  es: string
}

export interface PricingPlan {
  audience: LocalizedText
  features: LocalizedText[]
  featured?: boolean
  id: 'starter' | 'growth' | 'scale' | 'enterprise'
  name: LocalizedText
  summary: LocalizedText
}

export const pricingPlans: readonly PricingPlan[] = [
  {
    id: 'starter',
    name: { en: 'Starter', es: 'Inicial' },
    summary: {
      en: 'A controlled foundation for one team and one primary sending stream.',
      es: 'Una base controlada para un equipo y un flujo principal.'
    },
    audience: {
      en: 'Early production workloads',
      es: 'Primeras cargas de producción'
    },
    features: [
      {
        en: 'Transactional API and SMTP foundations',
        es: 'Fundamentos de API transaccional y SMTP'
      },
      {
        en: 'Domain and webhook operations',
        es: 'Operación de dominios y webhooks'
      },
      {
        en: 'Standard usage and delivery reporting',
        es: 'Reportes estándar de uso y entrega'
      }
    ]
  },
  {
    id: 'growth',
    name: { en: 'Growth', es: 'Crecimiento' },
    summary: {
      en: 'Campaign, profile, and automation capabilities for a growing operation.',
      es: 'Campañas, perfiles y automatización para una operación en crecimiento.'
    },
    audience: {
      en: 'Product and marketing teams',
      es: 'Equipos de producto y marketing'
    },
    featured: true,
    features: [
      {
        en: 'Customer data, segments, and journeys',
        es: 'Datos de clientes, segmentos y recorridos'
      },
      {
        en: 'Consent and decision evidence',
        es: 'Consentimiento y evidencia de decisión'
      },
      {
        en: 'Expanded analytics and integrations',
        es: 'Analítica e integraciones ampliadas'
      }
    ]
  },
  {
    id: 'scale',
    name: { en: 'Scale', es: 'Escala' },
    summary: {
      en: 'Advanced governance, multiple streams, and operational controls.',
      es: 'Gobernanza avanzada, múltiples flujos y controles operativos.'
    },
    audience: {
      en: 'High-volume and multi-team programs',
      es: 'Programas de alto volumen y múltiples equipos'
    },
    features: [
      {
        en: 'Simulation, attention, and reconciliation',
        es: 'Simulación, atención y reconciliación'
      },
      {
        en: 'Advanced roles and approval workflows',
        es: 'Roles avanzados y flujos de aprobación'
      },
      {
        en: 'Priority operational support options',
        es: 'Opciones de soporte operativo prioritario'
      }
    ]
  },
  {
    id: 'enterprise',
    name: { en: 'Enterprise', es: 'Empresa' },
    summary: {
      en: 'Private infrastructure, reseller models, and tailored controls.',
      es: 'Infraestructura privada, reventa y controles personalizados.'
    },
    audience: {
      en: 'Regulated, reseller, and complex organizations',
      es: 'Organizaciones reguladas, revendedores y operaciones complejas'
    },
    features: [
      {
        en: 'Enterprise identity and policy extensions',
        es: 'Extensiones empresariales de identidad y política'
      },
      {
        en: 'White-label and commercial hierarchy options',
        es: 'Opciones de marca blanca y jerarquía comercial'
      },
      {
        en: 'Reviewed deployment and support architecture',
        es: 'Arquitectura revisada de despliegue y soporte'
      }
    ]
  }
] as const

export const commonPlanCapabilities: readonly LocalizedText[] = [
  {
    en: 'Tenant-safe identity and access boundaries',
    es: 'Límites seguros de identidad y acceso'
  },
  {
    en: 'Request IDs, audit context, and operational evidence',
    es: 'Request IDs, auditoría y evidencia operativa'
  },
  {
    en: 'Controlled staging and release practices',
    es: 'Prácticas controladas de staging y lanzamiento'
  }
] as const

export const useCases = [
  {
    id: 'api',
    en: 'Transactional API',
    es: 'API transaccional',
    path: '/solutions/developers'
  },
  {
    id: 'marketing',
    en: 'Marketing automation',
    es: 'Automatización de marketing',
    path: '/solutions/marketing-teams'
  },
  {
    id: 'reseller',
    en: 'Agency or reseller',
    es: 'Agencia o reventa',
    path: '/solutions/agencies-resellers'
  },
  {
    id: 'enterprise',
    en: 'Enterprise governance',
    es: 'Gobernanza empresarial',
    path: '/solutions/enterprise'
  },
  {
    id: 'odoo',
    en: 'Odoo and n8n integration',
    es: 'Integración con Odoo y n8n',
    path: '/solutions/odoo-automation'
  }
] as const satisfies ReadonlyArray<{
  en: string
  es: string
  id: string
  path: string
}>

export const localizedPricingText = (
  text: LocalizedText,
  locale: Locale
) => text[locale]
