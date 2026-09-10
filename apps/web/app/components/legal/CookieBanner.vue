<template>
  <aside v-if="initialized && !hasDecision" class="cookie-banner" aria-labelledby="cookie-banner-title">
    <div class="stack">
      <strong id="cookie-banner-title">{{ label('Your privacy choices', 'Tus opciones de privacidad') }}</strong>
      <p>{{ label('Klyrow uses necessary storage for security. Optional preference, analytics and marketing technologies stay off until you choose them.', 'Klyrow usa almacenamiento necesario para seguridad. Las tecnologías opcionales de preferencias, analítica y marketing permanecen desactivadas hasta que las elijas.') }}</p>
      <NuxtLink :to="localizePath('/cookies')">{{ label('Read the cookie notice', 'Lee el aviso de cookies') }}</NuxtLink>
    </div>
    <div class="cluster cookie-actions">
      <BaseButton type="button" @click="acceptAll">{{ label('Accept all', 'Aceptar todo') }}</BaseButton>
      <BaseButton type="button" variant="secondary" @click="rejectNonEssential">{{ label('Reject non-essential', 'Rechazar no esenciales') }}</BaseButton>
      <BaseButton type="button" variant="text" @click="customizeOpen = true">{{ label('Customize', 'Personalizar') }}</BaseButton>
    </div>
  </aside>
  <BaseDialog :open="customizeOpen" :title="label('Cookie settings', 'Ajustes de cookies')" @close="customizeOpen = false">
    <CookiePreferencesPanel @saved="customizeOpen = false" />
  </BaseDialog>
</template>

<script setup lang="ts">
const { locale, localizePath } = useLocale()
const { initialized, hasDecision, acceptAll, rejectNonEssential } = useConsentPreferences()
const customizeOpen = ref(false)
const label = (en: string, es: string) => (locale.value === 'es' ? es : en)
</script>

<style scoped>
.cookie-banner { position: fixed; z-index: 70; right: 1rem; bottom: 1rem; left: 1rem; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: center; width: min(74rem, calc(100% - 2rem)); margin-inline: auto; padding: 1.25rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); background: var(--surface-primary); box-shadow: var(--shadow-lg); }
.cookie-banner p { max-width: 58rem; margin: 0; color: var(--text-secondary); }
.cookie-actions { justify-content: flex-end; }
@media (max-width: 54rem) { .cookie-banner { grid-template-columns: 1fr; } .cookie-actions { justify-content: flex-start; } }
</style>
