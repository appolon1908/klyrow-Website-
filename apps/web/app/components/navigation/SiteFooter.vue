<template>
  <footer class="site-footer inverse">
    <div class="container footer-grid">
      <section class="footer-intro"><NuxtLink :to="localizePath('/')" class="footer-brand">Klyrow</NuxtLink><p>{{ t('footerIntro') }}</p><LanguageSwitcher /></section>
      <nav aria-label="Footer product"><h2>{{ t('product') }}</h2><NuxtLink :to="localizePath('/platform')">{{ t('platform') }}</NuxtLink><NuxtLink :to="localizePath('/pricing')">{{ t('pricing') }}</NuxtLink><NuxtLink :to="localizePath('/integrations')">{{ t('integrations') }}</NuxtLink></nav>
      <nav aria-label="Footer company"><h2>{{ t('company') }}</h2><NuxtLink :to="localizePath('/about')">{{ locale === 'es' ? 'Acerca de' : 'About' }}</NuxtLink><NuxtLink :to="localizePath('/security')">{{ locale === 'es' ? 'Seguridad' : 'Security' }}</NuxtLink><NuxtLink :to="localizePath('/contact')">{{ locale === 'es' ? 'Contacto' : 'Contact' }}</NuxtLink><NuxtLink :to="localizePath('/accessibility')">{{ locale === 'es' ? 'Accesibilidad' : 'Accessibility' }}</NuxtLink></nav>
      <nav aria-label="Footer legal"><h2>{{ t('legal') }}</h2><NuxtLink :to="localizePath('/legal')">{{ locale === 'es' ? 'Centro legal' : 'Legal center' }}</NuxtLink><NuxtLink :to="localizePath('/privacy')">{{ locale === 'es' ? 'Privacidad' : 'Privacy' }}</NuxtLink><NuxtLink :to="localizePath('/terms')">{{ locale === 'es' ? 'Términos' : 'Terms' }}</NuxtLink><NuxtLink :to="localizePath('/cookies')">Cookies</NuxtLink><NuxtLink :to="localizePath('/acceptable-use')">{{ locale === 'es' ? 'Uso aceptable' : 'Acceptable use' }}</NuxtLink><NuxtLink :to="localizePath('/cookie-settings')">{{ locale === 'es' ? 'Ajustes de cookies' : 'Cookie settings' }}</NuxtLink></nav>
    </div>
    <div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} Klyrow</span><span>{{ locale === 'es' ? 'Diseñado para comunicaciones confiables.' : 'Built for trustworthy communication.' }}</span></div>
  </footer>
</template>

<script setup lang="ts">
const { t, localizePath, locale } = useLocale()
</script>

<style scoped>
.site-footer { padding: 4rem 0 2rem; }
.footer-grid { display: grid; gap: 2.5rem; grid-template-columns: 2fr repeat(3, 1fr); }
.footer-intro { display: grid; max-width: 25rem; gap: 1rem; color: #bfc2dc; }
.footer-brand { color: #fff; font-size: 1.5rem; font-weight: 900; text-decoration: none; }
nav { display: grid; align-content: start; gap: .65rem; }
nav h2 { margin-bottom: .35rem; color: #fff; font-size: .86rem; letter-spacing: .08em; text-transform: uppercase; }
nav a { color: #c7c9dd; text-decoration: none; } nav a:hover { color: #fff; }
.footer-bottom { display: flex; gap: 1rem; justify-content: space-between; margin-top: 3.5rem; padding-top: 1.25rem; border-top: 1px solid rgb(255 255 255 / 12%); color: #969ab7; font-size: .82rem; }
:deep(.language-switcher) { color: #d4d6e8; }
@media (max-width: 48rem) { .footer-grid { grid-template-columns: repeat(2, 1fr); } .footer-intro { grid-column: 1 / -1; } }
@media (max-width: 28rem) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom { align-items: flex-start; flex-direction: column; } }
</style>
