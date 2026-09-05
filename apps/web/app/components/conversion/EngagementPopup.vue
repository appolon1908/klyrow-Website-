<script setup lang="ts">
import { englishContentPathFromRoute } from '../../../content'

const config = useRuntimeConfig()
const route = useRoute()
const { locale } = useContentLocale()
const dialog = ref<HTMLDialogElement | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

const enabled = computed(() => {
  const value = (config.public as Record<string, unknown>).engagementPopupEnabled
  return value === true || value === 'true'
})
const allowedRoute = computed(() => {
  const path = englishContentPathFromRoute(route.path)
  return ![
    '/privacy',
    '/terms',
    '/cookies',
    '/acceptable-use',
    '/security-disclosure'
  ].includes(path)
})

const dismissed = () =>
  import.meta.client && sessionStorage.getItem('klyrow_engagement_dismissed') === '1'

const dismiss = () => {
  dialog.value?.close()
  if (import.meta.client) {
    sessionStorage.setItem('klyrow_engagement_dismissed', '1')
  }
}

const maybeOpen = () => {
  if (!import.meta.client || !enabled.value || !allowedRoute.value || dismissed()) return
  if (dialog.value && !dialog.value.open) dialog.value.showModal()
}

onMounted(() => {
  timer = setTimeout(maybeOpen, 20_000)
})
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <dialog
    ref="dialog"
    class="hz-engagement-dialog"
    aria-labelledby="klyrow-engagement-title"
    @cancel.prevent="dismiss"
  >
    <div class="hz-stack" style="--hz-stack-gap: 1rem">
      <div class="hz-engagement-dialog__header">
        <p class="hz-eyebrow">
          {{ locale === 'es' ? 'Demostración controlada' : 'Controlled demonstration' }}
        </p>
        <button
          class="hz-engagement-dialog__close"
          type="button"
          :aria-label="locale === 'es' ? 'Cerrar diálogo' : 'Close dialog'"
          @click="dismiss"
        >
          ×
        </button>
      </div>
      <h2 id="klyrow-engagement-title">
        {{
          locale === 'es'
            ? '¿Quieres ver Klyrow en tu flujo?'
            : 'See Klyrow in your workflow'
        }}
      </h2>
      <p>
        {{
          locale === 'es'
            ? 'Solicita una conversación enfocada en tu caso. Este aviso está desactivado por defecto y no envía datos por sí mismo.'
            : 'Request a conversation focused on your use case. This prompt is disabled by default and submits no data by itself.'
        }}
      </p>
      <div class="hz-cluster">
        <RegisteredCta id="popup-request-demo" @click="dismiss" />
        <button class="hz-button hz-button--secondary" type="button" @click="dismiss">
          {{ locale === 'es' ? 'Ahora no' : 'Not now' }}
        </button>
      </div>
    </div>
  </dialog>
</template>
