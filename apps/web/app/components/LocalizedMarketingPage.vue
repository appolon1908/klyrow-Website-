<script setup lang="ts">
import type { Locale } from '@klyrow/contracts'
import type { MarketingPageContent } from '../../content'
import {
  localizedContentPath,
  resolveMarketingCtaTarget
} from '../../content'
import { klyrowDomains } from '~/config/domains'

const props = defineProps<{
  page: MarketingPageContent
}>()

const locale = computed<Locale>(() => props.page.locale)
const localize = (path: string) => localizedContentPath(locale.value, path)
const pointTitles = computed(() =>
  props.page.points.map((_, index) =>
    locale.value === 'es' ? `Capacidad ${index + 1}` : `Capability ${index + 1}`
  )
)
const sections = computed(() =>
  props.page.points.map((body, index) => ({
    title: pointTitles.value[index] ?? String(index + 1),
    body
  }))
)
const oppositeLocalePath = computed(() =>
  localizedContentPath(locale.value === 'es' ? 'en' : 'es', props.page.path)
)
const primaryTarget = computed(() =>
  resolveMarketingCtaTarget(
    locale.value,
    props.page.path,
    props.page.primaryCta.target,
    props.page.formId,
    klyrowDomains.contact
  )
)
const secondaryTarget = computed(() =>
  props.page.secondaryCta
    ? resolveMarketingCtaTarget(
        locale.value,
        props.page.path,
        props.page.secondaryCta.target,
        props.page.formId,
        klyrowDomains.contact
      )
    : undefined
)
</script>

<template>
  <article>
    <nav class="hz-container hz-content-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <NuxtLink :to="locale === 'es' ? '/es' : '/'">
            {{ locale === 'es' ? 'Inicio' : 'Home' }}
          </NuxtLink>
        </li>
        <li aria-current="page">{{ page.title }}</li>
      </ol>
      <NuxtLink class="hz-content-language" :to="oppositeLocalePath" :hreflang="locale === 'es' ? 'en' : 'es'">
        {{ locale === 'es' ? 'English' : 'Español' }}
      </NuxtLink>
    </nav>

    <MarketingPage
      :eyebrow="page.eyebrow"
      :title="page.title"
      :lead="page.summary"
      :sections="sections"
      :primary-label="primaryTarget ? page.primaryCta.label : undefined"
      :primary-to="primaryTarget"
      :secondary-label="secondaryTarget ? page.secondaryCta?.label : undefined"
      :secondary-to="secondaryTarget"
    />

    <section class="hz-section">
      <div class="hz-container hz-grid hz-content-detail-grid">
        <article class="hz-card">
          <div class="hz-card__body hz-stack">
            <p class="hz-eyebrow">{{ locale === 'es' ? 'Cómo avanzar' : 'How to proceed' }}</p>
            <h2>{{ locale === 'es' ? 'Una ruta controlada' : 'A controlled path' }}</h2>
            <ol class="hz-content-steps">
              <li v-for="(step, index) in page.steps" :key="step">
                <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                <p>{{ step }}</p>
              </li>
            </ol>
          </div>
        </article>

        <aside class="hz-card" :aria-label="locale === 'es' ? 'Páginas relacionadas' : 'Related pages'">
          <div class="hz-card__body hz-stack">
            <p class="hz-eyebrow">{{ locale === 'es' ? 'Continuar' : 'Continue' }}</p>
            <h2>{{ locale === 'es' ? 'Explora temas relacionados' : 'Explore related topics' }}</h2>
            <ul class="hz-content-related">
              <li v-for="related in page.related" :key="related">
                <NuxtLink :to="localize(related)">{{ related }}</NuxtLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  </article>
</template>
