<template>
  <details class="accordion">
    <summary>{{ title }}</summary>
    <div class="accordion__content"><slot /></div>
  </details>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped>
.accordion { border-block-end: 1px solid var(--border-subtle); }
summary { padding-block: 1rem; font-weight: 780; cursor: pointer; }
.accordion__content { padding: 0 0 1.25rem; color: var(--text-secondary); }
</style>
