<script setup lang="ts">
useSeoMeta({ title: 'Platform | Klyrow', description: 'Klyrow messaging platform architecture and operating boundaries.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/platform' }] })

const sections = [
  { title: 'Same-origin product boundary', body: 'Browser requests are designed to enter through versioned application endpoints rather than connecting directly to providers or back-office systems.' },
  { title: 'Middleware authority', body: 'Codestra middleware remains the controlled boundary for provider delivery, Odoo synchronization and optional automation.' },
  { title: 'Durable outcomes', body: 'Externally visible operations require durable acceptance, idempotency and honest reconciliation when an outcome is uncertain.' },
  { title: 'Capability-aware UI', body: 'The product surface should show whether delivery, billing, automation or a provider is enabled instead of presenting unavailable controls.' }
] as const
</script>

<template>
  <MarketingPage
    eyebrow="Klyrow platform"
    title="A controlled path from application request to delivery evidence."
    lead="Klyrow is designed around explicit service boundaries, durable outcomes and transparent capability state."
    :sections="sections"
    primary-label="Contact sales"
    primary-to="/contact"
    secondary-label="Review security"
    secondary-to="/security"
  />
</template>
