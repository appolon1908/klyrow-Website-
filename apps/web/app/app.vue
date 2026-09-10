<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
    'data-horizon-root': '',
    'data-horizon-theme': 'klyrow',
    'data-horizon-appearance': 'dark'
  }
})
</script>

<template>
  <div class="hz-page-shell">
    <a class="hz-skip-link" href="#main-content">Skip to main content</a>
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
  </div>
</template>
