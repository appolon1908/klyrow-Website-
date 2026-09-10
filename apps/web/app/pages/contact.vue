<script setup lang="ts">
import { klyrowDomains } from '~/config/domains'

useSeoMeta({ title: 'Contact sales | Klyrow', description: 'Contact Codestra about Klyrow messaging and delivery requirements.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/contact' }] })
</script>

<template>
  <article>
    <section class="hz-section">
      <div class="hz-container hz-stack" style="--hz-stack-gap: 1.5rem">
        <p class="hz-eyebrow">Contact sales</p>
        <h1 class="hz-title">Describe the messaging problem you need to solve.</h1>
        <p class="hz-lead">The current public site does not submit leads directly. Use the established Codestra contact route for a scoped conversation about delivery volume, integrations, regions, compliance and support.</p>
        <div class="hz-cluster">
          <a class="hz-button hz-button--primary" :href="klyrowDomains.contact">Open Codestra contact</a>
          <NuxtLink class="hz-button hz-button--secondary" to="/platform">Review the platform</NuxtLink>
        </div>
      </div>
    </section>

    <section class="hz-section hz-callout">
      <div class="hz-container hz-grid hz-feature-grid">
        <article class="hz-card"><div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem"><span class="hz-feature-index">01</span><h2>Delivery scope</h2><p>Message type, expected volume, regions, senders and operational hours.</p></div></article>
        <article class="hz-card"><div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem"><span class="hz-feature-index">02</span><h2>Integration scope</h2><p>Applications, APIs, webhooks, middleware, CRM and automation boundaries.</p></div></article>
        <article class="hz-card"><div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem"><span class="hz-feature-index">03</span><h2>Trust requirements</h2><p>Identity, tenant isolation, retention, consent, audit and support expectations.</p></div></article>
      </div>
    </section>
  </article>
</template>
