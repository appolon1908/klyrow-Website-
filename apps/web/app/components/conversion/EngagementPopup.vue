<template>
  <BaseDialog :open="open" :title="locale === 'es' ? '¿Quieres ver Klyrow en tu flujo?' : 'See Klyrow in your workflow'" @close="dismiss">
    <div class="stack"><p class="muted">{{ locale === 'es' ? 'Solicita una demostración enfocada en tu caso de uso. No mostraremos este mensaje otra vez durante esta sesión.' : 'Request a demonstration focused on your use case. We will not show this message again during this session.' }}</p><RegisteredCta id="popup-request-demo" @click="dismiss" /></div>
  </BaseDialog>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const { locale } = useLocale()
const open = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const allowedRoute = computed(() => !['/privacy', '/terms', '/cookies', '/acceptable-use'].some((path) => route.path.endsWith(path)))
const dismiss = () => {
  open.value = false
  if (import.meta.client) sessionStorage.setItem('klyrow_engagement_dismissed', '1')
}
const maybeOpen = () => {
  if (!import.meta.client || !Boolean(config.public.engagementPopupEnabled) || !allowedRoute.value) return
  if (sessionStorage.getItem('klyrow_engagement_dismissed')) return
  open.value = true
}

onMounted(() => {
  timer = setTimeout(maybeOpen, 20000)
})
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>
