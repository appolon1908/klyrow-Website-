<template>
  <article class="card" :class="{ 'card--interactive': interactive }">
    <slot />
  </article>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ interactive?: boolean }>(), { interactive: false })
</script>

<style scoped>
.card { display: grid; gap: 1rem; }
.card--interactive { transition: transform var(--motion-fast) ease, box-shadow var(--motion-fast) ease; }
.card--interactive:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
</style>
