<template>
  <div class="site-frame">
    <a class="skip-link" href="#main-content">{{ t('skip') }}</a>
    <AnnouncementBanner />
    <SiteHeader />
    <main id="main-content" tabindex="-1"><slot /></main>
    <SiteFooter />
    <EngagementPopup />
    <CookieBanner />
    <ToastRegion />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()
useHead(() => ({ htmlAttrs: { lang: locale.value } }))
</script>
