import type { Locale } from '@klyrow/contracts'

const messages = {
  en: {
    skip: 'Skip to content',
    product: 'Product',
    solutions: 'Solutions',
    integrations: 'Integrations',
    developers: 'Developers',
    pricing: 'Pricing',
    resources: 'Resources',
    signIn: 'Sign in',
    start: 'Start building',
    demo: 'Request a demo',
    menu: 'Open menu',
    close: 'Close menu',
    language: 'Español',
    platform: 'Platform',
    company: 'Company',
    legal: 'Legal',
    footerIntro: 'Governed customer communications with delivery, automation and back-office clarity.',
  },
  es: {
    skip: 'Saltar al contenido',
    product: 'Producto',
    solutions: 'Soluciones',
    integrations: 'Integraciones',
    developers: 'Desarrolladores',
    pricing: 'Precios',
    resources: 'Recursos',
    signIn: 'Iniciar sesión',
    start: 'Comenzar a crear',
    demo: 'Solicitar una demostración',
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    language: 'English',
    platform: 'Plataforma',
    company: 'Empresa',
    legal: 'Legal',
    footerIntro: 'Comunicaciones gobernadas con entrega, automatización y claridad operativa.',
  },
} as const

type MessageKey = keyof (typeof messages)['en']

export const useLocale = () => {
  const route = useRoute()
  const locale = computed<Locale>(() => (route.path === '/es' || route.path.startsWith('/es/') ? 'es' : 'en'))
  const t = (key: MessageKey) => messages[locale.value][key]
  const localizePath = (path: string) => {
    if (locale.value === 'en') return path
    return path === '/' ? '/es' : `/es${path}`
  }
  const switchLocalePath = computed(() => {
    if (locale.value === 'en') return route.path === '/' ? '/es' : `/es${route.path}`
    const english = route.path.replace(/^\/es(?=\/|$)/, '')
    return english || '/'
  })

  return { locale, t, localizePath, switchLocalePath }
}
