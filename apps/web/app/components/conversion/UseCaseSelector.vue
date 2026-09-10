<script setup lang="ts">
import { useContentLocale } from '../../composables/useContentLocale'
import { useCases } from '../../data/pricing'

const { locale, localizePath } = useContentLocale()
const selected = ref('')
const options = computed(() =>
  useCases.map((item) => ({
    label: item[locale.value],
    value: item.id
  }))
)
const result = computed(() =>
  useCases.find((item) => item.id === selected.value)
)
</script>

<template>
  <section class="hz-section" aria-labelledby="klyrow-use-case-title">
    <div class="hz-container">
      <article class="hz-card hz-use-case-selector">
        <div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem">
          <p class="hz-eyebrow">
            {{ locale === 'es' ? 'Encuentra tu ruta' : 'Find your path' }}
          </p>
          <h2 id="klyrow-use-case-title" class="hz-title">
            {{ locale === 'es' ? '¿Qué deseas construir?' : 'What are you building?' }}
          </h2>
          <p class="hz-lead">
            {{
              locale === 'es'
                ? 'Elige un objetivo y revisa la solución pública más relevante.'
                : 'Choose a goal and review the most relevant public solution.'
            }}
          </p>
        </div>

        <div class="hz-card__body hz-use-case-controls">
          <label class="hz-field-label" for="klyrow-use-case">
            {{ locale === 'es' ? 'Caso de uso' : 'Use case' }}
          </label>
          <select id="klyrow-use-case" v-model="selected" class="hz-select" name="use-case">
            <option value="">
              {{ locale === 'es' ? 'Selecciona una opción' : 'Select an option' }}
            </option>
            <option v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <NuxtLink
            v-if="result"
            class="hz-button hz-button--primary"
            :to="localizePath(result.path)"
          >
            {{ locale === 'es' ? 'Explorar solución' : 'Explore solution' }}
          </NuxtLink>
          <p class="hz-field-help" aria-live="polite">
            {{
              result
                ? locale === 'es'
                  ? 'La selección abre una página informativa. No activa ningún servicio.'
                  : 'The selection opens an information page. It does not activate a service.'
                : locale === 'es'
                  ? 'No se enviará información hasta que elijas una ruta.'
                  : 'No information is submitted when you choose a path.'
            }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
