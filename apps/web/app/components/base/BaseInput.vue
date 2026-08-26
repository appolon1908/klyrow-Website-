<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <input
      :id="id"
      class="field__control"
      :name="name"
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      :required="required"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      :aria-invalid="invalid || undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
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
    hint?: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'url'
    autocomplete?: string
    required?: boolean
    invalid?: boolean
  }>(),
  { type: 'text', required: false, invalid: false },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
