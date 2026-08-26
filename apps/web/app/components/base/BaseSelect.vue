<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <select
      :id="id"
      class="field__control"
      :name="name"
      :value="modelValue"
      :required="required"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    name: string
    label: string
    modelValue: string
    placeholder?: string
    options: { label: string; value: string }[]
    required?: boolean
  }>(),
  { placeholder: 'Select an option', required: false },
)
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
