<template>
  <article>
    <section class="page-hero section">
      <div class="container stack">
        <Breadcrumbs :path="page.path" :title="page.title" />
        <span class="eyebrow">{{ page.eyebrow }}</span>
        <h1>{{ page.title }}</h1>
        <p class="lede">{{ page.summary }}</p>
        <div class="cluster">
          <BaseButton :to="localizedContentPath(page.locale, page.primaryCta.target)">{{ page.primaryCta.label }}</BaseButton>
          <BaseButton v-if="page.secondaryCta" :to="localizedContentPath(page.locale, page.secondaryCta.target)" variant="secondary">{{ page.secondaryCta.label }}</BaseButton>
        </div>
      </div>
    </section>

    <section class="section page-points">
      <div class="container stack">
        <span class="eyebrow">{{ page.locale === 'es' ? 'Capacidades' : 'Capabilities' }}</span>
        <h2>{{ page.locale === 'es' ? 'Lo que aporta esta parte de Klyrow' : 'What this part of Klyrow provides' }}</h2>
        <div class="grid"><BaseCard v-for="(point, index) in page.points" :key="point" interactive><span class="badge">0{{ index + 1 }}</span><h3>{{ point }}</h3></BaseCard></div>
      </div>
    </section>

    <section class="section inverse">
      <div class="container how-grid">
        <div class="stack"><span class="eyebrow how-eyebrow">{{ page.locale === 'es' ? 'Cómo funciona' : 'How it works' }}</span><h2>{{ page.locale === 'es' ? 'Un camino claro hacia producción' : 'A clear path toward production' }}</h2></div>
        <ol class="how-list"><li v-for="(step, index) in page.steps" :key="step"><span>{{ index + 1 }}</span><p>{{ step }}</p></li></ol>
      </div>
    </section>

    <RelatedPages :paths="page.related" />
  </article>
</template>

<script setup lang="ts">
import { localizedContentPath } from '../../../content'
import type { MarketingPageContent } from '../../../content'

const props = defineProps<{ page: MarketingPageContent }>()
useSeoMeta(() => ({ title: props.page.title, description: props.page.summary, ogTitle: props.page.title, ogDescription: props.page.summary }))
</script>

<style scoped>
.page-hero { padding-top: clamp(3rem, 8vw, 7rem); }
.page-hero h1 { max-width: 16ch; }
.page-points { background: linear-gradient(180deg, transparent, rgb(241 243 255 / 70%)); }
.how-grid { display: grid; gap: 4rem; grid-template-columns: .85fr 1.15fr; align-items: start; }
.how-eyebrow { color: var(--accent-cyan); }
.how-list { display: grid; gap: 1rem; padding: 0; list-style: none; }
.how-list li { display: grid; gap: 1rem; grid-template-columns: auto 1fr; align-items: center; padding: 1rem; border: 1px solid rgb(255 255 255 / 12%); border-radius: var(--radius-md); background: rgb(255 255 255 / 5%); }
.how-list span { display: grid; width: 2.2rem; height: 2.2rem; place-items: center; border-radius: 50%; color: #111326; background: var(--accent-lime); font-weight: 900; }
@media (max-width: 48rem) { .how-grid { grid-template-columns: 1fr; } }
</style>
