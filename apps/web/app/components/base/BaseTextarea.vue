<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <textarea
      :id="id"
      class="field__control field__textarea"
      :name="name"
      :value="modelValue"
      :rows="rows"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    name: string
    label: string
    modelValue: string
    rows?: number
    required?: boolean
    hint?: string
    invalid?: boolean
  }>(),
  { rows: 6, required: false, invalid: false },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.field__textarea { min-height: 9rem; resize: vertical; }
</style>
