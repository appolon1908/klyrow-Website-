<script setup lang="ts">
import { useRegisteredCta } from '../../composables/useRegisteredCta'
import type { CtaId } from '../../data/cta-registry'

const props = defineProps<{
  id: CtaId
  variant?: 'primary' | 'secondary' | 'text' | undefined
}>()
const emit = defineEmits<{
  click: []
}>()

const {
  disabled,
  external,
  href,
  label,
  variant: resolvedVariant
} = useRegisteredCta(props.id)

const classes = computed(() => {
  const variant = props.variant ?? resolvedVariant.value
  return [
    'hz-button',
    variant === 'primary'
      ? 'hz-button--primary'
      : variant === 'secondary'
        ? 'hz-button--secondary'
        : 'hz-button--text'
  ]
})
</script>

<template>
  <a
    v-if="href && !disabled && external"
    :href="href"
    :class="classes"
    :data-cta-id="id"
    rel="noopener noreferrer"
    @click="emit('click')"
  >
    {{ label }}
  </a>
  <NuxtLink
    v-else-if="href && !disabled"
    :to="href"
    :class="classes"
    :data-cta-id="id"
    @click="emit('click')"
  >
    {{ label }}
  </NuxtLink>
</template>
