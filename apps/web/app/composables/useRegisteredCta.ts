import { ctaRegistry, formRouteMap, type CtaId } from '../data/cta-registry'

export const useRegisteredCta = (id: CtaId) => {
  const config = useRuntimeConfig()
  const { locale, localizePath } = useLocale()
  const registered = ctaRegistry[id]
  const runtimeValue = (target: string) => {
    if (target === 'runtime:signInUrl') return String(config.public.signInUrl || '')
    if (target === 'runtime:docsUrl') return String(config.public.docsUrl || '')
    if (target === 'runtime:statusUrl') return String(config.public.statusUrl || '')
    return target
  }
  const href = computed(() => {
    const definition = registered.definition
    if (definition.kind === 'route') return localizePath(definition.target)
    if (definition.kind === 'form') return `${localizePath(formRouteMap[definition.target] ?? '/contact')}?form=${encodeURIComponent(definition.target)}`
    const resolved = runtimeValue(definition.target)
    return resolved || localizePath(registered.fallbackRoute ?? '/')
  })
  return {
    definition: registered.definition,
    label: computed(() => registered.labels[locale.value]),
    href,
    external: computed(() => ['external', 'auth', 'download'].includes(registered.definition.kind) && href.value.startsWith('http')),
  }
}
