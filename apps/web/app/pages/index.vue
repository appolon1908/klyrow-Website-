<script setup lang="ts">
useSeoMeta({
  title: 'Klyrow | Controlled messaging infrastructure',
  description: 'Explore Klyrow delivery, developer, security and automation capabilities within the Codestra operating boundary.',
  ogTitle: 'Klyrow | Controlled messaging infrastructure',
  ogDescription: 'Messaging infrastructure, developer integration and operational controls for modern teams.',
  ogUrl: 'https://klyrow.com'
})
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/' }] })

const capabilities = [
  { title: 'Delivery foundation', body: 'A product surface for transactional and approved campaign messaging without exposing provider credentials to the browser.' },
  { title: 'Developer integration', body: 'Documented, versioned integration patterns designed to pass through the Codestra middleware authority.' },
  { title: 'Operational evidence', body: 'Delivery requests, durable receipts and reconciliation states can remain visible without inventing success.' },
  { title: 'Controlled automation', body: 'Automation may assist approved workflows while authoritative state remains in the owning system.' }
] as const
</script>

<template>
  <article>
    <section class="hz-hero">
      <div class="hz-container hz-hero__content">
        <div class="hz-kicker-line" />
        <p class="hz-eyebrow">Klyrow communications platform</p>
        <h1 class="hz-display">Messaging infrastructure that stays under control.</h1>
        <p class="hz-lead">Build delivery, automation and developer experiences on one clear operating boundary—without hiding readiness, credentials or provider state.</p>
        <div class="hz-cluster">
          <NuxtLink class="hz-button hz-button--primary" to="/contact">Contact sales</NuxtLink>
          <NuxtLink class="hz-button hz-button--secondary" to="/developers">Explore developer integration</NuxtLink>
        </div>
      </div>
    </section>

    <section class="hz-section">
      <div class="hz-container hz-stack" style="--hz-stack-gap: 2.5rem">
        <div class="hz-stack" style="--hz-stack-gap: 1rem">
          <p class="hz-eyebrow">Platform direction</p>
          <h2 class="hz-title">One experience from request to evidence.</h2>
          <p class="hz-lead">The public website describes supported product boundaries. It does not claim that live email delivery, billing, automation or external providers are active until their separate production gates pass.</p>
        </div>
        <div class="hz-grid hz-feature-grid">
          <article v-for="(capability, index) in capabilities" :key="capability.title" class="hz-card">
            <div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem">
              <span class="hz-feature-index">0{{ index + 1 }}</span>
              <h3>{{ capability.title }}</h3>
              <p>{{ capability.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </article>
</template>
