<script setup lang="ts">
useSeoMeta({ title: 'Pricing | Klyrow', description: 'Contact-led Klyrow pricing until approved public plans are available.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/pricing' }] })

const sections = [
  { title: 'Contact-led plans', body: 'Public prices are not displayed until an approved pricing authority, billing configuration and customer terms are available.' },
  { title: 'Scope before estimate', body: 'Delivery volume, regions, message type, compliance needs, support and integration scope affect an appropriate plan.' },
  { title: 'No hidden activation', body: 'A sales conversation does not enable live delivery, billing, providers or automation without separate approved activation.' },
  { title: 'Clear commercial evidence', body: 'Approved quotes, plan terms and billing state should be visible and durable before a customer is charged.' }
] as const
</script>

<template>
  <MarketingPage
    eyebrow="Pricing"
    title="Pricing begins with the delivery scope."
    lead="Klyrow remains contact-led until approved public prices and billing controls are available. No placeholder plans or invented discounts are shown."
    :sections="sections"
    primary-label="Contact sales"
    primary-to="/contact"
    secondary-label="Explore platform"
    secondary-to="/platform"
  />
</template>
