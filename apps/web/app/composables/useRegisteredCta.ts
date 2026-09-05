import {
  resolveRegisteredCta,
  type CtaId,
  type CtaRuntimeValues
} from '../data/cta-registry'

export const useRegisteredCta = (id: CtaId) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { locale } = useContentLocale()

  const runtime = computed<CtaRuntimeValues>(() => {
    const values = config.public as Record<string, unknown>
    return {
      applicationLoginUrl: String(values.applicationLoginUrl ?? ''),
      applicationSignupUrl: String(values.applicationSignupUrl ?? ''),
      contactUrl: String(values.contactUrl ?? ''),
      docsUrl: String(values.docsUrl ?? ''),
      schedulingUrl: String(values.schedulingUrl ?? ''),
      statusUrl: String(values.statusUrl ?? '')
    }
  })

  const resolved = computed(() =>
    resolveRegisteredCta(id, {
      currentPath: route.path,
      locale: locale.value,
      runtime: runtime.value
    })
  )

  return {
    disabled: computed(() => resolved.value.disabled),
    external: computed(() => resolved.value.external),
    href: computed(() => resolved.value.href),
    label: computed(() => resolved.value.label),
    variant: computed(() => resolved.value.variant)
  }
}
