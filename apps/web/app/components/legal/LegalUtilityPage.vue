<template>
  <article class="section legal-utility"><div class="container stack">
    <template v-if="utility.kind === 'cookie-settings'"><span class="eyebrow">{{ label('Privacy controls', 'Controles de privacidad') }}</span><h1>{{ label('Cookie settings', 'Ajustes de cookies') }}</h1><p class="lede">{{ label('Change or withdraw optional technology choices at any time.', 'Cambia o retira las opciones de tecnologías opcionales en cualquier momento.') }}</p><CookiePreferencesPanel /></template>
    <template v-else-if="utility.kind === 'privacy-request'"><span class="eyebrow">{{ label('Privacy', 'Privacidad') }}</span><h1>{{ label('Submit a privacy request', 'Envía una solicitud de privacidad') }}</h1><PublicForm form-id="privacy-request" /></template>
    <template v-else-if="utility.kind === 'privacy-opt-out'"><span class="eyebrow">{{ label('Privacy choice', 'Opción de privacidad') }}</span><h1>{{ label('Submit an applicable opt-out', 'Envía una exclusión aplicable') }}</h1><PublicForm form-id="privacy-opt-out" /></template>
    <template v-else-if="utility.kind === 'version-history'"><span class="eyebrow">{{ label('Document control', 'Control documental') }}</span><h1>{{ label('Legal version history', 'Historial de versiones legales') }}</h1><div class="table-wrap"><table><thead><tr><th>{{ label('Document', 'Documento') }}</th><th>{{ label('Version', 'Versión') }}</th><th>{{ label('Status', 'Estado') }}</th><th>{{ label('Updated', 'Actualizado') }}</th></tr></thead><tbody><tr v-for="entry in documents" :key="entry.id"><td><NuxtLink :to="entry.canonicalPath">{{ entry.title }}</NuxtLink></td><td>{{ entry.version }}</td><td>{{ entry.status }}</td><td>{{ entry.lastUpdated }}</td></tr></tbody></table></div></template>
    <template v-else><span class="eyebrow">{{ label('Privacy request', 'Solicitud de privacidad') }}</span><h1>{{ label('Request status', 'Estado de la solicitud') }}</h1><FormStatus :status="loading ? 'submitting' : errorMessage ? 'error' : 'accepted'" :locale="locale" :message="statusMessage" :reference="utility.token" /></template>
  </div></article>
</template>

<script setup lang="ts">
import type { Locale } from '@klyrow/contracts'
import { getLegalDocuments } from '../../../legal'
import type { LegalUtilityRoute } from '../../../legal'

const props = defineProps<{ utility: LegalUtilityRoute; locale: Locale }>()
const documents = computed(() => getLegalDocuments(props.locale))
const loading = ref(false)
const errorMessage = ref('')
const remoteStatus = ref('')
const label = (en: string, es: string) => (props.locale === 'es' ? es : en)
const statusMessage = computed(() => errorMessage.value || remoteStatus.value || label('The request reference is being checked.', 'Se está verificando la referencia de la solicitud.'))
useSeoMeta({ robots: 'noindex,nofollow' })

onMounted(async () => {
  if (props.utility.kind !== 'privacy-status' || !props.utility.token) return
  loading.value = true
  try {
    const response = await $fetch<{ data: { status: string } }>(`/api/v1/privacy/requests/${encodeURIComponent(props.utility.token)}`)
    remoteStatus.value = label(`Current status: ${response.data.status}.`, `Estado actual: ${response.data.status}.`)
  } catch {
    errorMessage.value = label('The status could not be retrieved. Verify the reference or contact privacy support.', 'No se pudo consultar el estado. Verifica la referencia o contacta a privacidad.')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.legal-utility { min-height: 65vh; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; } th, td { padding: .8rem; border-bottom: 1px solid var(--border-subtle); text-align: left; }
</style>
