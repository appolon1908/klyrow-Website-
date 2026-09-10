<script setup lang="ts">
import { codestraProductNetwork, klyrowDomains } from '~/config/domains'

const year = new Date().getFullYear()
const groups = [
  {
    title: 'Platform',
    links: [
      ['Delivery platform', '/platform'],
      ['Developer tools', '/developers'],
      ['Security', '/security'],
      ['Pricing', '/pricing']
    ]
  },
  {
    title: 'Company',
    links: [
      ['Contact sales', '/contact'],
      ['Open Klyrow app', klyrowDomains.application],
      ['Codestra', klyrowDomains.corporate]
    ]
  },
  {
    title: 'Trust',
    links: [
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Security disclosure', '/security']
    ]
  }
] as const
</script>

<template>
  <footer class="hz-site-footer">
    <div class="hz-container">
      <div class="hz-site-footer__grid">
        <section class="hz-site-footer__intro" aria-labelledby="klyrow-footer-title">
          <NuxtLink class="hz-brand" to="/" aria-label="Klyrow home">
            <span class="hz-brand__mark" aria-hidden="true">K</span>
            <span>Klyrow</span>
            <span class="hz-brand__domain">klyrow.com</span>
          </NuxtLink>
          <p class="hz-eyebrow">Codestra product network</p>
          <h2 id="klyrow-footer-title" class="hz-site-footer__title">
            Messaging infrastructure with a controlled operating boundary.
          </h2>
          <p>
            Explore delivery capabilities, developer integration, security controls, and sales routes without
            exposing provider credentials or moving account authority into the public website.
          </p>
          <div class="hz-domain-list" aria-label="Klyrow domains">
            <a class="hz-domain-chip" :href="klyrowDomains.public">klyrow.com</a>
            <a class="hz-domain-chip" :href="klyrowDomains.application">app.klyrow.com</a>
            <a class="hz-domain-chip" :href="klyrowDomains.corporate">codestra.co</a>
          </div>
        </section>

        <nav v-for="group in groups" :key="group.title" :aria-label="group.title">
          <h3 class="hz-site-footer__heading">{{ group.title }}</h3>
          <ul class="hz-site-footer__links">
            <li v-for="link in group.links" :key="link[1]">
              <NuxtLink v-if="link[1].startsWith('/')" class="hz-site-footer__link" :to="link[1]">
                {{ link[0] }}
              </NuxtLink>
              <a v-else class="hz-site-footer__link" :href="link[1]">{{ link[0] }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="hz-site-footer__bottom">
        <span>© {{ year }} Klyrow. Operated within the Codestra platform.</span>
        <div class="hz-footer-legal" aria-label="Codestra product network">
          <a
            v-for="product in codestraProductNetwork"
            :key="product.href"
            class="hz-site-footer__link"
            :href="product.href"
          >
            {{ product.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
