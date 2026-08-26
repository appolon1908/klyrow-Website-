<template>
  <a v-if="external" :href="href" :class="classes" rel="noopener noreferrer">{{ label }}</a>
  <NuxtLink v-else :to="href" :class="classes">{{ label }}</NuxtLink>
</template>

<script setup lang="ts">
import type { CtaId } from '../../data/cta-registry'
const props = defineProps<{ id: CtaId; variant?: 'primary' | 'secondary' | 'text' }>()
const { definition, label, href, external } = useRegisteredCta(props.id)
const classes = computed(() => ['button', `button--${props.variant ?? definition.variant}`])
</script>
