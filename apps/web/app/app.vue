<script setup lang="ts">
import {
  englishContentPathFromRoute,
  localeFromRoutePath,
  routeManifest
} from '../content'

const route = useRoute()
const locale = computed(() => localeFromRoutePath(route.path))
const alternateEntry = computed(() => {
  const englishPath = englishContentPathFromRoute(route.path)
  return routeManifest.find((entry) => entry.path === englishPath)
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
    'data-horizon-root': '',
    'data-horizon-theme': 'klyrow',
    'data-horizon-appearance': 'dark'
  },
  link: alternateEntry.value
    ? [
        {
          rel: 'alternate',
          hreflang: 'en',
          href: `https://klyrow.com${alternateEntry.value.path}`
        },
        {
          rel: 'alternate',
          hreflang: 'es',
          href: `https://klyrow.com${alternateEntry.value.esPath}`
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `https://klyrow.com${alternateEntry.value.path}`
        }
      ]
    : []
}))
</script>

<template>
  <div class="hz-page-shell">
    <a class="hz-skip-link" href="#main-content">
      {{ locale === 'es' ? 'Saltar al contenido principal' : 'Skip to main content' }}
    </a>
    <AnnouncementBanner />
    <AppHeader />
    <AuthNotice />
    <NuxtErrorBoundary>
      <main id="main-content" tabindex="-1">
        <NuxtPage />
      </main>
      <template #error="{ error, clearError }">
        <ScaffoldError :error="error" @retry="clearError" />
      </template>
    </NuxtErrorBoundary>
    <AppFooter />
    <EngagementPopup />
  </div>
</template>
