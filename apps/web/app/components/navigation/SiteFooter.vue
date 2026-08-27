<template>
  <footer class="site-footer inverse">
    <div class="container footer-conversion">
      <div class="stack">
        <span class="eyebrow">Built for accountable delivery</span>
        <h2>Communication infrastructure your team can explain.</h2>
        <p>Bring delivery, consent, automation and operations into one governed system.</p>
      </div>
      <BaseButton :to="localizePath('/contact')">Talk to Klyrow</BaseButton>
    </div>

    <div class="container footer-grid">
      <section class="footer-intro">
        <NuxtLink :to="localizePath('/')" class="footer-brand"><span class="footer-brand__mark">K</span><span>Klyrow</span></NuxtLink>
        <p>{{ t('footerIntro') }}</p>
        <LanguageSwitcher />
      </section>
      <nav aria-label="Footer product"><h2>{{ t('product') }}</h2><NuxtLink :to="localizePath('/platform')">{{ t('platform') }}</NuxtLink><NuxtLink :to="localizePath('/pricing')">{{ t('pricing') }}</NuxtLink><NuxtLink :to="localizePath('/integrations')">{{ t('integrations') }}</NuxtLink></nav>
      <nav aria-label="Footer company"><h2>{{ t('company') }}</h2><NuxtLink :to="localizePath('/about')">About</NuxtLink><NuxtLink :to="localizePath('/security')">Security</NuxtLink><NuxtLink :to="localizePath('/contact')">Contact</NuxtLink></nav>
      <nav aria-label="Footer legal"><h2>{{ t('legal') }}</h2><NuxtLink :to="localizePath('/privacy')">Privacy</NuxtLink><NuxtLink :to="localizePath('/terms')">Terms</NuxtLink><NuxtLink :to="localizePath('/cookies')">Cookies</NuxtLink><NuxtLink :to="localizePath('/acceptable-use')">Acceptable use</NuxtLink></nav>
    </div>
    <div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} Klyrow</span><span>Built for trustworthy communication.</span></div>
  </footer>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'

const { t, localizePath } = useLocale()
</script>

<style scoped>
.site-footer { padding: 0 0 2rem; border-top: 1px solid var(--border-subtle); }
.footer-conversion { display: flex; padding-block: clamp(4rem, 8vw, 7rem); align-items: end; justify-content: space-between; gap: 2rem; border-bottom: 1px solid var(--border-subtle); }
.footer-conversion .stack { max-width: 52rem; }
.footer-conversion h2 { font-size: clamp(2.2rem, 5vw, 4.6rem); }
.footer-conversion p { max-width: 42rem; color: var(--text-secondary); }
.footer-grid { display: grid; gap: 2.5rem; padding-top: 4rem; grid-template-columns: 2fr repeat(3, 1fr); }
.footer-intro { display: grid; max-width: 25rem; gap: 1rem; color: var(--text-secondary); }
.footer-brand { display: inline-flex; width: fit-content; gap: .65rem; align-items: center; color: var(--text-primary); font-size: 1.25rem; font-weight: 800; text-decoration: none; }
.footer-brand__mark { display: grid; width: 2rem; height: 2rem; place-items: center; border: 1px solid var(--brand-primary); border-radius: var(--radius-xs); color: var(--surface-deep); background: var(--brand-primary); font-size: .78rem; font-weight: 900; }
nav { display: grid; align-content: start; gap: .65rem; }
nav h2 { margin-bottom: .35rem; color: var(--text-primary); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; }
nav a { min-height: 32px; color: var(--text-secondary); text-decoration: none; }
nav a:hover { color: var(--brand-primary); }
.footer-bottom { display: flex; gap: 1rem; justify-content: space-between; margin-top: 3.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); color: var(--text-muted); font-size: .78rem; }
:deep(.language-switcher) { color: var(--text-secondary); }
@media (max-width: 48rem) { .footer-conversion { align-items: flex-start; flex-direction: column; } .footer-grid { grid-template-columns: repeat(2, 1fr); } .footer-intro { grid-column: 1 / -1; } }
@media (max-width: 28rem) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom { align-items: flex-start; flex-direction: column; } }
</style>
