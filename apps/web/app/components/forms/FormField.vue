<template>
  <div class="form-field">
    <BaseCheckbox
      v-if="field.kind === 'checkbox'"
      :name="field.key"
      :model-value="Boolean(modelValue)"
      :required="field.required"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      {{ localized(field.label, locale) }}
    </BaseCheckbox>
    <BaseSelect
      v-else-if="field.kind === 'select'"
      :id="inputId"
      :name="field.key"
      :label="localized(field.label, locale)"
      :model-value="String(modelValue ?? '')"
      :required="field.required"
      :invalid="Boolean(error)"
      :hint="error || (field.hint ? localized(field.hint, locale) : undefined)"
      :placeholder="locale === 'es' ? 'Selecciona una opción' : 'Select an option'"
      :options="(field.options ?? []).map((entry) => ({ value: entry.value, label: localized(entry.label, locale) }))"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <BaseTextarea
      v-else-if="field.kind === 'textarea'"
      :id="inputId"
      :name="field.key"
      :label="localized(field.label, locale)"
      :model-value="String(modelValue ?? '')"
      :required="field.required"
      :invalid="Boolean(error)"
      :hint="error || (field.hint ? localized(field.hint, locale) : undefined)"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <BaseInput
      v-else
      :id="inputId"
      :name="field.key"
      :label="localized(field.label, locale)"
      :model-value="String(modelValue ?? '')"
      :type="field.kind"
      :autocomplete="field.autocomplete"
      :required="field.required"
      :invalid="Boolean(error)"
      :hint="error || (field.hint ? localized(field.hint, locale) : undefined)"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '@klyrow/contracts'
import { localized } from '../../data/form-registry'
import type { FormFieldDefinition } from '../../data/form-registry'

const props = defineProps<{
  formId: string
  field: FormFieldDefinition
  locale: Locale
  modelValue: string | boolean
  error?: string
}>()

defineEmits<{ 'update:modelValue': [value: string | boolean] }>()
const inputId = computed(() => `${props.formId}-${props.field.key}`)
</script>
