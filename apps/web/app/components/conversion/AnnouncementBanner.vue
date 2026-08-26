<template>
  <div v-if="message && !dismissed" class="announcement" role="status"><div class="container announcement__inner"><span>{{ message }}</span><button type="button" :aria-label="locale === 'es' ? 'Cerrar anuncio' : 'Dismiss announcement'" @click="dismissed = true">×</button></div></div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useLocale()
const dismissed = ref(false)
const message = computed(() => String(config.public.announcement || ''))
</script>

<style scoped>
.announcement { color: #101224; background: linear-gradient(90deg, var(--accent-lime), var(--accent-cyan)); font-weight: 750; }
.announcement__inner { display: flex; min-height: 2.6rem; align-items: center; justify-content: center; gap: 1rem; text-align: center; }
button { border: 0; background: transparent; font-size: 1.3rem; cursor: pointer; }
</style>
