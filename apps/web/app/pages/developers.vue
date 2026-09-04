<script setup lang="ts">
useSeoMeta({ title: 'Developers | Klyrow', description: 'Klyrow developer integration principles and API readiness.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/developers' }] })

const sections = [
  { title: 'Versioned contracts', body: 'Public integration behavior is documented through versioned schemas, stable error codes and explicit compatibility rules.' },
  { title: 'Safe credentials', body: 'Provider, middleware, Odoo, automation and identity credentials stay server-side and are never embedded in a browser bundle.' },
  { title: 'Idempotent writes', body: 'Externally visible commands require request identity, canonical payload binding and durable response evidence.' },
  { title: 'Testable failure states', body: 'Validation, rate limiting, provider unavailability, unknown outcomes and reconciliation remain part of the contract—not afterthoughts.' }
] as const
</script>

<template>
  <MarketingPage
    eyebrow="Developer platform"
    title="Integrate through contracts, not hidden provider shortcuts."
    lead="Klyrow developer surfaces are intended to be versioned, observable and safe under retries and partial failure."
    :sections="sections"
    primary-label="Discuss an integration"
    primary-to="/contact"
    secondary-label="View platform"
    secondary-to="/platform"
  />
</template>
