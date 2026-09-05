<script setup lang="ts">
import { getMarketingPage, localizedContentPath } from '../../../content'

const route = useRoute()
const segments = computed(() => {
  const value = route.params.slug
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return value ? [String(value)] : []
})
const contentPath = computed(() => `/${segments.value.join('/')}`)
const page = computed(() => getMarketingPage('es', contentPath.value))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página de Klyrow no encontrada' })
}

useSeoMeta({
  title: () => `${page.value?.title ?? 'Klyrow'} | Klyrow`,
  description: () => page.value?.summary ?? 'Información del producto Klyrow.'
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: `https://klyrow.com${localizedContentPath('es', contentPath.value)}`
    }
  ]
}))
</script>

<template>
  <LocalizedMarketingPage v-if="page" :page="page" />
</template>
