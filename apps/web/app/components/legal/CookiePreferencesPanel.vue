<template>
  <div class="stack preference-panel">
    <div class="preference-row">
      <div><strong>{{ label('Necessary', 'Necesarias') }}</strong><p>{{ label('Required for security, request integrity and consent storage.', 'Necesarias para seguridad, integridad de solicitudes y almacenamiento del consentimiento.') }}</p></div>
      <span class="badge">{{ label('Always on', 'Siempre activas') }}</span>
    </div>
    <div class="preference-row"><div><strong>{{ label('Preferences', 'Preferencias') }}</strong><p>{{ label('Language and optional experience settings.', 'Idioma y ajustes opcionales de experiencia.') }}</p></div><BaseCheckbox v-model="draft.preferences" name="preferences">{{ label('Allow', 'Permitir') }}</BaseCheckbox></div>
    <div class="preference-row"><div><strong>{{ label('Analytics', 'Analítica') }}</strong><p>{{ label('Optional aggregate measurement when configured.', 'Medición agregada opcional cuando esté configurada.') }}</p></div><BaseCheckbox v-model="draft.analytics" name="analytics">{{ label('Allow', 'Permitir') }}</BaseCheckbox></div>
    <div class="preference-row"><div><strong>{{ label('Marketing', 'Marketing') }}</strong><p>{{ label('Optional marketing technologies; disabled by default.', 'Tecnologías de marketing opcionales; desactivadas por defecto.') }}</p></div><BaseCheckbox v-model="draft.marketing" name="marketing">{{ label('Allow', 'Permitir') }}</BaseCheckbox></div>
    <div class="cluster"><BaseButton type="button" @click="saveDraft">{{ label('Save choices', 'Guardar opciones') }}</BaseButton><BaseButton type="button" variant="secondary" @click="rejectNonEssential">{{ label('Reject non-essential', 'Rechazar no esenciales') }}</BaseButton></div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ saved: [] }>()
const { locale } = useLocale()
const { preferences, save, rejectNonEssential: reject } = useConsentPreferences()
const draft = reactive({ preferences: false, analytics: false, marketing: false })
const label = (en: string, es: string) => (locale.value === 'es' ? es : en)

watchEffect(() => {
  draft.preferences = preferences.value.preferences
  draft.analytics = preferences.value.analytics
  draft.marketing = preferences.value.marketing
})
const saveDraft = () => { save(draft, 'settings'); emit('saved') }
const rejectNonEssential = () => { reject(); emit('saved') }
</script>

<style scoped>
.preference-panel { gap: 1rem; }
.preference-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1.5rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-subtle); }
.preference-row p { margin: .25rem 0 0; color: var(--text-secondary); }
@media (max-width: 34rem) { .preference-row { grid-template-columns: 1fr; } }
</style>
