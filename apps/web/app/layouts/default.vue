<template>
  <div class="site-frame marketing-route">
    <a class="skip-link" href="#main-content">{{ t('skip') }}</a>
    <SiteHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <SiteFooter />
    <ToastRegion />
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

defineOptions({ name: 'MarketingDefaultLayout' })

const { t, locale } = useLocale()

useHead(() => ({ htmlAttrs: { lang: locale.value } }))
</script>
