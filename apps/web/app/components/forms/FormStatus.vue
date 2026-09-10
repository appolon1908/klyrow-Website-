<template>
  <div v-if="status !== 'idle'" class="form-status" :class="`form-status--${status}`" role="status" aria-live="polite">
    <strong>{{ title }}</strong>
    <p>{{ message }}</p>
    <p v-if="reference" class="form-status__reference">{{ referenceLabel }}: {{ reference }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '@klyrow/contracts'

const props = defineProps<{
  status: 'idle' | 'submitting' | 'accepted' | 'error'
  locale: Locale
  message: string
  reference?: string
}>()

const title = computed(() => {
  if (props.status === 'submitting') return props.locale === 'es' ? 'Enviando' : 'Submitting'
  if (props.status === 'accepted') return props.locale === 'es' ? 'Solicitud aceptada' : 'Request accepted'
  return props.locale === 'es' ? 'No pudimos completar la solicitud' : 'We could not complete the request'
})
const referenceLabel = computed(() => (props.locale === 'es' ? 'Referencia' : 'Reference'))
</script>

<style scoped>
.form-status { padding: 1rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--surface-secondary); }
.form-status--accepted { border-color: color-mix(in srgb, var(--success) 55%, white); }
.form-status--error { border-color: color-mix(in srgb, var(--danger) 55%, white); }
.form-status__reference { color: var(--text-secondary); font-size: .9rem; }
</style>
