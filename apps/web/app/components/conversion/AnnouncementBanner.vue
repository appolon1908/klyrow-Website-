<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useContentLocale()
const dismissed = ref(false)
const message = computed(() =>
  String((config.public as Record<string, unknown>).announcement ?? '').trim()
)
</script>

<template>
  <div v-if="message && !dismissed" class="hz-announcement" role="status">
    <div class="hz-container hz-announcement__inner">
      <span>{{ message }}</span>
      <button
        class="hz-announcement__dismiss"
        type="button"
        :aria-label="locale === 'es' ? 'Cerrar anuncio' : 'Dismiss announcement'"
        @click="dismissed = true"
      >
        ×
      </button>
    </div>
  </div>
</template>
