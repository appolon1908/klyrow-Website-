<template>
  <label class="checkbox">
    <input
      :name="name"
      type="checkbox"
      :checked="modelValue"
      :required="required"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span><slot /></span>
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ name: string; modelValue: boolean; required?: boolean }>(), { required: false })
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.checkbox { display: flex; gap: .7rem; align-items: flex-start; cursor: pointer; }
.checkbox input { width: 1.2rem; height: 1.2rem; margin-top: .15rem; accent-color: var(--brand-primary); }
</style>
