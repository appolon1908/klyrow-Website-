<template>
  <NuxtLink class="language-switcher" :to="switchLocalePath" :hreflang="locale === 'en' ? 'es' : 'en'">{{ t('language') }}</NuxtLink>
</template>

<script setup lang="ts">
const { locale, t, switchLocalePath } = useLocale()
</script>

<style scoped>
.language-switcher { color: var(--text-secondary); font-size: .88rem; font-weight: 700; text-decoration: none; }
.language-switcher:hover { color: var(--brand-primary-strong); }
</style>
