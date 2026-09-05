<script setup lang="ts">
import { getMarketingPage } from '../../../content'

const page = getMarketingPage('es', '/')
if (!page) {
  throw createError({ statusCode: 500, statusMessage: 'Falta el contenido principal en español' })
}

useSeoMeta({
  title: `${page.title} | Klyrow`,
  description: page.summary
})

useHead({
  htmlAttrs: { lang: 'es' },
  link: [
    { rel: 'canonical', href: 'https://klyrow.com/es' },
    { rel: 'alternate', hreflang: 'en', href: 'https://klyrow.com/' },
    { rel: 'alternate', hreflang: 'es', href: 'https://klyrow.com/es' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://klyrow.com/' }
  ]
})
</script>

<template>
  <LocalizedMarketingPage :page="page" />
</template>
