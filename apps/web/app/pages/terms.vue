<script setup lang="ts">
useSeoMeta({ title: 'Terms | Klyrow', description: 'Klyrow public website terms boundary.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/terms' }] })

const sections = [
  { title: 'Public information', body: 'Website descriptions are informational and do not by themselves create a service order, delivery commitment or provider activation.' },
  { title: 'Approved agreement required', body: 'Commercial service requires an approved quote or plan, applicable terms, authorized identity and explicit activation evidence.' },
  { title: 'No implied availability', body: 'A visible feature does not mean a provider, destination, region, billing path or automation is currently enabled.' },
  { title: 'Production legal gate', body: 'Complete entity, jurisdiction, acceptable-use, messaging, privacy and service terms must be approved before the website accepts a binding order.' }
] as const
</script>

<template>
  <MarketingPage
    eyebrow="Terms"
    title="A website visit is not a delivery activation."
    lead="This branch states the operating boundary honestly while complete production commercial and messaging terms remain subject to their separate approval gates."
    :sections="sections"
    primary-label="Contact sales"
    primary-to="/contact"
    secondary-label="Review privacy"
    secondary-to="/privacy"
  />
</template>
