<script setup lang="ts">
import { getMarketingPage } from '../../content'

const route = useRoute()
const segments = computed(() => {
  const value = route.params.slug
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return value ? [String(value)] : []
})
const contentPath = computed(() => `/${segments.value.join('/')}`)
const page = computed(() => getMarketingPage('en', contentPath.value))

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Klyrow page not found' })
}

useSeoMeta({
  title: () => `${page.value?.title ?? 'Klyrow'} | Klyrow`,
  description: () => page.value?.summary ?? 'Klyrow product information.'
})

useHead(() => ({
  link: [
    { rel: 'canonical', href: `https://klyrow.com${contentPath.value}` }
  ]
}))
</script>

<template>
  <LocalizedMarketingPage v-if="page" :page="page" />
</template>
