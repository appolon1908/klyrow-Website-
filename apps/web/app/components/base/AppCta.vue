<template>
  <NuxtLink v-if="definition.kind === 'route'" :to="localizePath(definition.target)" :class="classes">{{ label }}</NuxtLink>
  <a v-else-if="definition.kind === 'external' || definition.kind === 'auth' || definition.kind === 'download'" :href="definition.target" :class="classes" rel="noopener noreferrer">{{ label }}</a>
  <button v-else type="button" :class="classes" @click="$emit('form', definition.target)">{{ label }}</button>
</template>

<script setup lang="ts">
import type { CtaDefinition } from '@klyrow/contracts'

const props = defineProps<{ definition: CtaDefinition; label: string }>()
defineEmits<{ form: [formId: string] }>()
const { localizePath } = useLocale()
const classes = computed(() => ['button', `button--${props.definition.variant}`])
</script>
