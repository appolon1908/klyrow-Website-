<script setup lang="ts">
defineProps<{ error: unknown }>()
const emit = defineEmits<{ retry: [] }>()
</script>
<template>
  <main role="alert">
    <h1>Unable to render scaffold</h1>
    <button type="button" @click="emit('retry')">Try again</button>
  </main>
</template>
