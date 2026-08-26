<template>
  <section class="section">
    <div class="container conversion-band glass">
      <div class="stack"><span class="eyebrow">{{ locale === 'es' ? 'Siguiente paso' : 'Next step' }}</span><h2>{{ title }}</h2><p class="lede">{{ copy }}</p></div>
      <RegisteredCta :id="ctaId" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CtaId } from '../../data/cta-registry'
withDefaults(defineProps<{ title: string; copy: string; ctaId?: CtaId }>(), { ctaId: 'nav-request-demo' })
const { locale } = useLocale()
</script>

<style scoped>
.conversion-band { display: flex; padding: clamp(2rem, 5vw, 4rem); align-items: center; justify-content: space-between; gap: 2rem; border-radius: 2rem; }
.conversion-band h2 { max-width: 42rem; }
@media (max-width: 48rem) { .conversion-band { align-items: flex-start; flex-direction: column; } }
</style>
