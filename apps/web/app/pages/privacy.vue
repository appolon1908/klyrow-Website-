<script setup lang="ts">
useSeoMeta({ title: 'Privacy | Klyrow', description: 'Klyrow public website privacy notice.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/privacy' }] })

const sections = [
  { title: 'Public website data', body: 'The public site should collect only the data necessary to operate the website, respond to requests and protect the service.' },
  { title: 'No credential exposure', body: 'Provider, middleware, identity, Odoo and automation credentials are never public website data.' },
  { title: 'Consent separation', body: 'Service contact and optional marketing consent must remain distinct, specific and revocable.' },
  { title: 'Requests and updates', body: 'A complete production privacy notice must identify the operating entity, request channel, retention rules and applicable rights before data-collection forms are activated.' }
] as const
</script>

<template>
  <MarketingPage
    eyebrow="Privacy"
    title="Privacy controls must be complete before lead collection is enabled."
    lead="This source-side notice describes the required boundary. The public site does not claim a live lead form or marketing program in this branch."
    :sections="sections"
    primary-label="Contact the team"
    primary-to="/contact"
    secondary-label="Review terms"
    secondary-to="/terms"
  />
</template>
