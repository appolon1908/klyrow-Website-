<template>
  <NuxtLink v-if="to" :to="to" :class="classes"><slot /></NuxtLink>
  <button v-else :type="type" :class="classes" :disabled="disabled"><slot /></button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string | null
    variant?: 'primary' | 'secondary' | 'quiet' | 'text' | 'link' | 'danger'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  { to: null, variant: 'primary', type: 'button', disabled: false },
)

const classes = computed(() => ['button', `button--${props.variant}`])
</script>
