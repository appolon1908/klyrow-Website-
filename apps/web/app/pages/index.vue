<template>
  <div>
    <section class="hero section">
      <div class="container hero-grid">
        <div class="stack hero-copy">
          <span class="eyebrow">Governed customer communications</span>
          <h1>Email infrastructure with a reason behind every send.</h1>
          <p class="lede">Klyrow connects delivery, consent, automation and back-office operations in one explainable system.</p>
          <div class="cluster">
            <AppCta :definition="primaryCta" label="Start building" />
            <AppCta :definition="secondaryCta" label="Request a demo" />
          </div>
        </div>
        <div class="product-orbit glass" aria-label="Klyrow platform architecture illustration">
          <div class="orbit-core">K</div>
          <span class="orbit-node orbit-node--one">API</span><span class="orbit-node orbit-node--two">Postal</span><span class="orbit-node orbit-node--three">Odoo</span><span class="orbit-node orbit-node--four">n8n</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container stack">
        <span class="eyebrow">A clearer operating model</span>
        <h2>Build, send and prove what happened.</h2>
        <div class="grid">
          <BaseCard v-for="item in capabilities" :key="item.title" interactive>
            <span class="badge">{{ item.kicker }}</span><h3>{{ item.title }}</h3><p class="muted">{{ item.copy }}</p>
          </BaseCard>
        </div>
      </div>
    </section>

    <section class="section inverse">
      <div class="container story-grid">
        <div class="stack"><span class="eyebrow story-eyebrow">Designed for trust</span><h2>One timeline from intent to business outcome.</h2><p class="lede story-lede">Follow the identity, policy, message, provider result, automation and CRM record without exposing credentials or private infrastructure.</p></div>
        <ol class="timeline">
          <li v-for="(step, index) in steps" :key="step"><span>{{ index + 1 }}</span>{{ step }}</li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container final-cta glass">
        <div class="stack"><span class="eyebrow">Ready when your team is</span><h2>Start with the architecture. Grow into the full platform.</h2></div>
        <BaseButton to="/demo">Request a demo</BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CtaDefinition } from '@klyrow/contracts'

useSeoMeta({ title: 'Governed email infrastructure', description: 'Klyrow brings email delivery, consent, automation and back-office operations into one explainable platform.' })

const primaryCta: CtaDefinition = { id: 'hero-start-building', labelKey: 'start', kind: 'route', target: '/developers', analyticsEvent: 'cta_click', variant: 'primary' }
const secondaryCta: CtaDefinition = { id: 'hero-request-demo', labelKey: 'demo', kind: 'route', target: '/demo', analyticsEvent: 'cta_click', variant: 'secondary' }
const capabilities = [
  { kicker: 'Send', title: 'Transactional and marketing streams', copy: 'Keep operational and marketing traffic clear, scoped and measurable.' },
  { kicker: 'Govern', title: 'Consent and decision evidence', copy: 'Record the policy and context that permitted or blocked each communication.' },
  { kicker: 'Operate', title: 'Middleware, automation and CRM', copy: 'Route durable events through middleware into n8n and Odoo without browser coupling.' },
]
const steps = ['A customer or system creates an intent', 'Klyrow evaluates consent, policy and quota', 'Postal or an approved provider handles delivery', 'Middleware correlates automation and Odoo records']
</script>

<style scoped>
.hero { overflow: hidden; }
.hero-grid { display: grid; min-height: min(45rem, calc(100vh - 4.7rem)); align-items: center; gap: 4rem; grid-template-columns: minmax(0, 1.25fr) minmax(18rem, .75fr); }
.hero-copy { position: relative; z-index: 2; }
.product-orbit { position: relative; min-height: 30rem; border-radius: 50% 42% 48% 38%; background: linear-gradient(145deg, rgb(255 255 255 / 78%), rgb(235 232 255 / 72%)); }
.orbit-core { position: absolute; inset: 50% auto auto 50%; display: grid; width: 7rem; height: 7rem; place-items: center; border-radius: 2rem; color: #fff; background: linear-gradient(145deg, var(--brand-primary), var(--accent-cyan)); box-shadow: var(--shadow-lg); font-size: 3rem; font-weight: 900; transform: translate(-50%, -50%); }
.orbit-node { position: absolute; padding: .65rem .9rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); background: #fff; box-shadow: var(--shadow-md); font-weight: 800; }
.orbit-node--one { top: 14%; left: 14%; }.orbit-node--two { top: 18%; right: 7%; }.orbit-node--three { right: 11%; bottom: 16%; }.orbit-node--four { bottom: 12%; left: 16%; }
.story-grid { display: grid; gap: 4rem; grid-template-columns: 1fr 1fr; align-items: center; }
.story-eyebrow { color: var(--accent-cyan); }.story-lede { color: #bfc2da; }
.timeline { display: grid; gap: 1rem; padding: 0; list-style: none; }
.timeline li { display: grid; padding: 1rem; align-items: center; gap: 1rem; grid-template-columns: auto 1fr; border: 1px solid rgb(255 255 255 / 12%); border-radius: var(--radius-md); background: rgb(255 255 255 / 5%); }
.timeline span { display: grid; width: 2.2rem; height: 2.2rem; place-items: center; border-radius: 50%; color: #111326; background: var(--accent-lime); font-weight: 900; }
.final-cta { display: flex; padding: clamp(2rem, 5vw, 4rem); align-items: center; justify-content: space-between; gap: 2rem; border-radius: 2rem; }
.final-cta h2 { max-width: 44rem; font-size: clamp(2rem, 4vw, 3.5rem); }
@media (max-width: 54rem) { .hero-grid, .story-grid { grid-template-columns: 1fr; } .product-orbit { min-height: 22rem; } .final-cta { align-items: flex-start; flex-direction: column; } }
</style>
