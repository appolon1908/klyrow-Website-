<script setup lang="ts">
interface ContentSection {
  title: string
  body: string
}

const props = defineProps<{
  eyebrow: string
  title: string
  lead: string
  sections: readonly ContentSection[]
  primaryLabel?: string | undefined
  primaryTo?: string | undefined
  secondaryLabel?: string | undefined
  secondaryTo?: string | undefined
}>()
</script>

<template>
  <article>
    <section class="hz-section">
      <div class="hz-container hz-stack" style="--hz-stack-gap: 1.5rem">
        <p class="hz-eyebrow">{{ props.eyebrow }}</p>
        <h1 class="hz-title">{{ props.title }}</h1>
        <p class="hz-lead">{{ props.lead }}</p>
        <div v-if="props.primaryLabel || props.secondaryLabel" class="hz-cluster">
          <NuxtLink v-if="props.primaryLabel && props.primaryTo" class="hz-button hz-button--primary" :to="props.primaryTo">
            {{ props.primaryLabel }}
          </NuxtLink>
          <NuxtLink v-if="props.secondaryLabel && props.secondaryTo" class="hz-button hz-button--secondary" :to="props.secondaryTo">
            {{ props.secondaryLabel }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="hz-section hz-callout">
      <div class="hz-container hz-grid hz-feature-grid">
        <article v-for="(section, index) in props.sections" :key="section.title" class="hz-card">
          <div class="hz-card__body hz-stack" style="--hz-stack-gap: 1rem">
            <span class="hz-feature-index">0{{ index + 1 }}</span>
            <h2>{{ section.title }}</h2>
            <p>{{ section.body }}</p>
          </div>
        </article>
      </div>
    </section>
  </article>
</template>
