<template>
  <section class="section">
    <div class="container selector glass">
      <div class="stack"><span class="eyebrow">{{ locale === 'es' ? 'Encuentra tu ruta' : 'Find your path' }}</span><h2>{{ locale === 'es' ? '¿Qué deseas construir?' : 'What are you building?' }}</h2><p class="lede">{{ locale === 'es' ? 'Elige un objetivo y te llevaremos a la solución más relevante.' : 'Choose a goal and we will point you to the most relevant solution.' }}</p></div>
      <div class="selector__controls"><BaseSelect id="use-case" v-model="selected" name="use-case" :label="locale === 'es' ? 'Caso de uso' : 'Use case'" :placeholder="locale === 'es' ? 'Selecciona una opción' : 'Select an option'" :options="options" /><BaseButton v-if="result" :to="localizePath(result.path)">{{ locale === 'es' ? 'Explorar solución' : 'Explore solution' }}</BaseButton></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCases } from '../../data/pricing'
const { locale, localizePath } = useLocale()
const selected = ref('')
const options = computed(() => useCases.map((item) => ({ value: item.id, label: item[locale.value] })))
const result = computed(() => useCases.find((item) => item.id === selected.value))
</script>

<style scoped>
.selector { display: grid; padding: clamp(2rem, 6vw, 4rem); gap: 3rem; grid-template-columns: 1.1fr .9fr; border-radius: 2rem; }
.selector__controls { display: grid; align-content: center; gap: 1rem; }
@media (max-width: 48rem) { .selector { grid-template-columns: 1fr; } }
</style>
