<script setup lang="ts">
useSeoMeta({ title: 'Security | Klyrow', description: 'Klyrow security, identity and controlled-delivery principles.' })
useHead({ link: [{ rel: 'canonical', href: 'https://klyrow.com/security' }] })

const sections = [
  { title: 'Shared identity authority', body: 'User and service identity is designed to use the approved Codestra identity boundary rather than product-local credential shortcuts.' },
  { title: 'Least-privilege delivery', body: 'Provider credentials, tenant mappings and delivery permissions remain scoped, server-side and auditable.' },
  { title: 'No false success', body: 'A transient provider response is not presented as durable completion when persistence, delivery or reconciliation is unresolved.' },
  { title: 'Protected data', body: 'Sensitive form bodies, credentials and private customer content must not be exposed through logs, analytics or public assets.' }
] as const
</script>

<template>
  <MarketingPage
    eyebrow="Security and trust"
    title="Security is part of the delivery path."
    lead="Klyrow’s public experience describes the controls required around identity, credentials, tenant isolation, evidence and failure handling."
    :sections="sections"
    primary-label="Contact the team"
    primary-to="/contact"
    secondary-label="Review developers"
    secondary-to="/developers"
  />
</template>
