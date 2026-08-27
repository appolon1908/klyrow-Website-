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
          <div class="hero-proof" aria-label="Platform principles">
            <span>Policy aware</span><span>API first</span><span>Audit ready</span>
          </div>
        </div>

        <div class="system-panel" aria-label="Klyrow platform architecture illustration">
          <div class="system-panel__header"><span>Klyrow control plane</span><span>Governed delivery</span></div>
          <div class="system-panel__body">
            <div v-for="item in systemFlow" :key="item.name" class="system-row">
              <span class="system-row__status" aria-hidden="true" />
              <div><strong>{{ item.name }}</strong><small>{{ item.detail }}</small></div>
              <span>{{ item.state }}</span>
            </div>
          </div>
          <div class="system-panel__footer">Intent → policy → delivery → business record</div>
        </div>
      </div>
    </section>

    <section class="section capability-section">
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

    <section class="section inverse story-section">
      <div class="container story-grid">
        <div class="stack"><span class="eyebrow">Designed for trust</span><h2>One timeline from intent to business outcome.</h2><p class="lede">Follow the identity, policy, message, provider result, automation and CRM record without exposing credentials or private infrastructure.</p></div>
        <ol class="timeline">
          <li v-for="(step, index) in steps" :key="step"><span>{{ index + 1 }}</span>{{ step }}</li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container final-cta">
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
const systemFlow = [
  { name: 'API gateway', detail: 'Authenticated intent', state: 'Ready' },
  { name: 'Policy engine', detail: 'Consent and quota', state: 'Checked' },
  { name: 'Delivery', detail: 'Approved provider route', state: 'Scoped' },
  { name: 'Business record', detail: 'Middleware and CRM evidence', state: 'Durable' },
]
const capabilities = [
  { kicker: 'Send', title: 'Transactional and marketing streams', copy: 'Keep operational and marketing traffic clear, scoped and measurable.' },
  { kicker: 'Govern', title: 'Consent and decision evidence', copy: 'Record the policy and context that permitted or blocked each communication.' },
  { kicker: 'Operate', title: 'Middleware, automation and CRM', copy: 'Route durable events through middleware into n8n and Odoo without browser coupling.' },
]
const steps = ['A customer or system creates an intent', 'Klyrow evaluates consent, policy and quota', 'Postal or an approved provider handles delivery', 'Middleware correlates automation and Odoo records']
</script>

<style scoped>
.hero { overflow: hidden; border-bottom: 1px solid var(--border-subtle); }
.hero-grid { display: grid; min-height: calc(100svh - var(--header-height)); align-items: center; gap: clamp(3rem, 8vw, 7rem); grid-template-columns: minmax(0, 1.12fr) minmax(22rem, .88fr); }
.hero-copy { position: relative; z-index: 2; }
.hero-copy h1 { max-width: 12ch; }
.hero-proof { display: flex; flex-wrap: wrap; gap: .75rem 1.5rem; padding-top: .5rem; color: var(--text-muted); font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.hero-proof span { display: inline-flex; align-items: center; gap: .45rem; }
.hero-proof span::before { width: .4rem; height: .4rem; background: var(--brand-primary); content: ''; }
.system-panel { border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--surface-deep); box-shadow: var(--shadow-lg); }
.system-panel__header,
.system-panel__footer { display: flex; min-height: 3.25rem; padding: .85rem 1rem; align-items: center; justify-content: space-between; gap: 1rem; color: var(--text-muted); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.system-panel__header { border-bottom: 1px solid var(--border-subtle); }
.system-panel__header span:first-child { color: var(--brand-primary); }
.system-panel__footer { border-top: 1px solid var(--border-subtle); }
.system-panel__body { display: grid; }
.system-row { display: grid; min-height: 5rem; padding: 1rem; align-items: center; gap: .8rem; grid-template-columns: auto 1fr auto; border-bottom: 1px solid var(--border-subtle); }
.system-row:last-child { border-bottom: 0; }
.system-row__status { width: .55rem; height: .55rem; border-radius: var(--radius-xs); background: var(--brand-primary); box-shadow: 0 0 0 4px var(--accent-soft); }
.system-row div { display: grid; gap: .15rem; }
.system-row strong { font-size: .86rem; }
.system-row small { color: var(--text-muted); }
.system-row > span:last-child { color: var(--text-secondary); font-size: .68rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
.capability-section { background: var(--surface-deep); }
.story-section { border-block: 1px solid var(--border-subtle); }
.story-grid { display: grid; gap: 4rem; grid-template-columns: 1fr 1fr; align-items: center; }
.timeline { display: grid; gap: .75rem; padding: 0; list-style: none; }
.timeline li { display: grid; padding: 1rem; align-items: center; gap: 1rem; grid-template-columns: auto 1fr; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--surface-elevated); }
.timeline span { display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border: 1px solid var(--brand-primary); border-radius: var(--radius-xs); color: var(--brand-primary); font-weight: 900; }
.final-cta { display: flex; padding: clamp(2rem, 5vw, 4rem); align-items: end; justify-content: space-between; gap: 2rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--surface-elevated); }
.final-cta h2 { max-width: 44rem; font-size: clamp(2rem, 4vw, 3.5rem); }
@media (max-width: 54rem) { .hero-grid, .story-grid { grid-template-columns: 1fr; } .hero-grid { min-height: auto; } .system-panel { min-height: auto; } .final-cta { align-items: flex-start; flex-direction: column; } }
</style>
