<template>
  <section class="status card" :data-tone="tone" :aria-live="live ? 'polite' : undefined">
    <span class="status__icon" aria-hidden="true">{{ icon }}</span>
    <div class="stack">
      <h2>{{ title }}</h2>
      <p class="muted">{{ message }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ title: string; message: string; tone?: 'info' | 'success' | 'warning' | 'danger'; live?: boolean }>(),
  { tone: 'info', live: false },
)
const icon = computed(() => ({ info: '●', success: '✓', warning: '!', danger: '×' })[props.tone])
</script>

<style scoped>
.status { display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start; }
.status__icon { display: grid; width: 2.3rem; height: 2.3rem; place-items: center; border-radius: var(--radius-sm); color: var(--text-on-accent); background: var(--brand-primary); font-weight: 900; }
.status[data-tone="success"] .status__icon { background: var(--success); }
.status[data-tone="warning"] .status__icon { background: var(--warning); }
.status[data-tone="danger"] .status__icon { background: var(--danger); }
.status h2 { font-size: 1.3rem; }
</style>
