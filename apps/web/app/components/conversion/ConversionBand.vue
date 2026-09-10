<script setup lang="ts">
import { useContentLocale } from '../../composables/useContentLocale'
import type { CtaId } from '../../data/cta-registry'

withDefaults(
  defineProps<{
    copy: string
    ctaId?: CtaId
    title: string
  }>(),
  { ctaId: 'nav-request-demo' }
)
const { locale } = useContentLocale()
</script>

<template>
  <section class="hz-section" aria-labelledby="klyrow-conversion-band-title">
    <div class="hz-container">
      <article class="hz-card hz-conversion-band">
        <div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem">
          <p class="hz-eyebrow">
            {{ locale === 'es' ? 'Siguiente paso' : 'Next step' }}
          </p>
          <h2 id="klyrow-conversion-band-title" class="hz-title">{{ title }}</h2>
          <p class="hz-lead">{{ copy }}</p>
        </div>
        <div class="hz-card__body hz-conversion-band__action">
          <RegisteredCta :id="ctaId" />
        </div>
      </article>
    </div>
  </section>
</template>
