<script setup lang="ts">
import { applicationBoundary, klyrowDomains } from '~/config/domains'

useSeoMeta({
  title: 'Klyrow application access',
  description: 'Open the secure Klyrow application for account and workspace operations.',
  robots: 'noindex, nofollow, noarchive'
})
</script>

<template>
  <section class="hz-section">
    <div class="hz-container hz-stack">
      <header class="hz-stack">
        <p class="hz-eyebrow">Secure application boundary</p>
        <h1 class="hz-title">Account operations live at app.klyrow.com.</h1>
        <p class="hz-lead">
          This public website does not exchange identity codes, store browser tokens, inspect account sessions, or
          invent billing, delivery, reputation, and campaign records.
        </p>
        <div class="hz-cluster">
          <a class="hz-button hz-button--primary" :href="klyrowDomains.application">Open Klyrow app</a>
          <a class="hz-button hz-button--secondary" :href="klyrowDomains.signup">Create account</a>
          <NuxtLink class="hz-button hz-button--secondary" to="/contact">Contact support</NuxtLink>
        </div>
      </header>

      <div class="hz-grid hz-feature-grid" aria-label="Application authority summary">
        <article class="hz-card">
          <div class="hz-card__body hz-stack">
            <p class="hz-eyebrow">Session authority</p>
            <h2>Server-side and encrypted</h2>
            <p>
              The authenticated application owns its secure host-only cookie, tenant checks, CSRF protection, and
              session revocation.
            </p>
          </div>
        </article>
        <article class="hz-card">
          <div class="hz-card__body hz-stack">
            <p class="hz-eyebrow">Browser token storage</p>
            <h2>{{ applicationBoundary.browserTokenStorage }}</h2>
            <p>The marketing bundle must never persist access, refresh, or identity tokens.</p>
          </div>
        </article>
        <article class="hz-card">
          <div class="hz-card__body hz-stack">
            <p class="hz-eyebrow">Durable identity</p>
            <h2 class="hz-mono-value">{{ applicationBoundary.durableIdentity }}</h2>
            <p>Authorization remains backend-owned and is never inferred from an email address.</p>
          </div>
        </article>
      </div>

      <div class="hz-card" role="status">
        <div class="hz-card__body hz-stack">
          <p class="hz-eyebrow">Public-site responsibility</p>
          <h2>Explain the product and hand off securely.</h2>
          <p>
            Marketing pages provide truthful product, developer, security, pricing, legal, and contact information.
            Protected account features are rendered only by the separately governed Klyrow application.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
