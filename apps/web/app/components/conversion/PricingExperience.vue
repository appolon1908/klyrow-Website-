<template>
  <section class="section pricing-experience">
    <div class="container stack">
      <div class="pricing-intro"><div class="stack"><span class="eyebrow">{{ locale === 'es' ? 'Comparar planes' : 'Compare plans' }}</span><h2>{{ locale === 'es' ? 'Empieza con la capacidad correcta' : 'Start with the right capability set' }}</h2><p class="lede">{{ pricingMode === 'configured' ? configuredCopy : contactCopy }}</p></div><RegisteredCta id="pricing-request-consultation" /></div>
      <div class="pricing-grid">
        <article v-for="plan in pricingPlans" :key="plan.id" class="card pricing-card" :class="{ 'pricing-card--featured': plan.featured }">
          <span v-if="plan.featured" class="badge">{{ locale === 'es' ? 'Más elegido' : 'Most selected' }}</span>
          <div class="stack"><h3>{{ plan.name[locale] }}</h3><p class="muted">{{ plan.summary[locale] }}</p><strong>{{ plan.audience[locale] }}</strong></div>
          <ul><li v-for="feature in plan.features" :key="feature.en">{{ feature[locale] }}</li></ul>
          <RegisteredCta id="pricing-contact-sales" :variant="plan.featured ? 'primary' : 'secondary'" />
        </article>
      </div>
      <div class="card comparison"><h3>{{ locale === 'es' ? 'Todos los planes incluyen' : 'Every plan includes' }}</h3><div class="grid"><p v-for="item in common" :key="item.en">✓ {{ item[locale] }}</p></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { pricingPlans } from '../../data/pricing'
const config = useRuntimeConfig()
const { locale } = useLocale()
const pricingMode = computed(() => String(config.public.pricingMode || 'contact_sales'))
const contactCopy = computed(() => locale.value === 'es' ? 'Los valores de producción requieren una configuración comercial aprobada. Te ayudamos a dimensionar el plan sin inventar precios.' : 'Production values require approved commercial configuration. We will help size the plan without inventing prices.')
const configuredCopy = computed(() => locale.value === 'es' ? 'Los rangos configurados son estimaciones no vinculantes y se validan antes de contratar.' : 'Configured ranges are non-binding estimates and are validated before contracting.')
const common = [
  { en: 'Tenant-safe identity and access boundaries', es: 'Límites seguros de identidad y acceso' },
  { en: 'Request IDs, audit context and operational evidence', es: 'Request IDs, auditoría y evidencia operativa' },
  { en: 'Controlled staging and release practices', es: 'Prácticas controladas de staging y lanzamiento' },
]
</script>

<style scoped>
.pricing-intro { display: flex; gap: 2rem; align-items: end; justify-content: space-between; }
.pricing-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.pricing-card { display: flex; min-height: 31rem; flex-direction: column; gap: 1.5rem; }
.pricing-card ul { display: grid; flex: 1; gap: .75rem; padding-left: 1.2rem; color: var(--text-secondary); }
.pricing-card--featured { border-color: rgb(91 77 247 / 50%); box-shadow: var(--shadow-lg); transform: translateY(-.7rem); }
.comparison { margin-top: 1rem; }
@media (max-width: 64rem) { .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 42rem) { .pricing-intro { align-items: flex-start; flex-direction: column; } .pricing-grid { grid-template-columns: 1fr; } .pricing-card--featured { transform: none; } }
</style>
