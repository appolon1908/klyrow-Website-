<script setup lang="ts">
import {
  commonPlanCapabilities,
  localizedPricingText,
  pricingPlans
} from '../../data/pricing'

const config = useRuntimeConfig()
const { locale } = useContentLocale()
const pricingMode = computed(() =>
  String((config.public as Record<string, unknown>).pricingMode ?? 'contact_sales')
)
const intro = computed(() => {
  if (pricingMode.value === 'configured') {
    return locale.value === 'es'
      ? 'Los rangos configurados son estimaciones no vinculantes y se validan antes de contratar.'
      : 'Configured ranges are non-binding estimates and are validated before contracting.'
  }
  return locale.value === 'es'
    ? 'Los valores de producción requieren una configuración comercial aprobada. Dimensionamos el plan sin inventar precios.'
    : 'Production values require approved commercial configuration. We size the plan without inventing prices.'
})
</script>

<template>
  <section class="hz-section hz-conversion-pricing" aria-labelledby="klyrow-pricing-title">
    <div class="hz-container hz-stack" style="--hz-stack-gap: 2.5rem">
      <div class="hz-conversion-intro">
        <div class="hz-stack" style="--hz-stack-gap: 1rem">
          <p class="hz-eyebrow">
            {{ locale === 'es' ? 'Comparar capacidades' : 'Compare capabilities' }}
          </p>
          <h2 id="klyrow-pricing-title" class="hz-title">
            {{ locale === 'es' ? 'Empieza con el alcance correcto' : 'Start with the right scope' }}
          </h2>
          <p class="hz-lead">{{ intro }}</p>
        </div>
        <RegisteredCta id="pricing-request-consultation" />
      </div>

      <div class="hz-grid hz-pricing-grid">
        <article
          v-for="plan in pricingPlans"
          :key="plan.id"
          class="hz-card hz-pricing-card"
          :class="{ 'hz-pricing-card--featured': plan.featured }"
        >
          <div class="hz-card__body hz-stack" style="--hz-stack-gap: 1.25rem">
            <p v-if="plan.featured" class="hz-eyebrow">
              {{ locale === 'es' ? 'Ruta destacada' : 'Featured path' }}
            </p>
            <h3>{{ localizedPricingText(plan.name, locale) }}</h3>
            <p>{{ localizedPricingText(plan.summary, locale) }}</p>
            <strong>{{ localizedPricingText(plan.audience, locale) }}</strong>
            <ul class="hz-pricing-features">
              <li v-for="feature in plan.features" :key="feature.en">
                {{ localizedPricingText(feature, locale) }}
              </li>
            </ul>
            <RegisteredCta
              id="pricing-contact-sales"
              :variant="plan.featured ? 'primary' : 'secondary'"
            />
          </div>
        </article>
      </div>

      <article class="hz-card">
        <div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem">
          <h3>{{ locale === 'es' ? 'Cada alcance incluye' : 'Every scope includes' }}</h3>
          <ul class="hz-conversion-checklist">
            <li v-for="item in commonPlanCapabilities" :key="item.en">
              {{ localizedPricingText(item, locale) }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
