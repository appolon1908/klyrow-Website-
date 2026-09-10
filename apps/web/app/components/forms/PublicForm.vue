<template>
  <section v-if="definition" class="section form-section" :aria-labelledby="`${formId}-title`">
    <div class="container form-layout">
      <div class="stack form-intro">
        <span class="eyebrow">{{ locale === 'es' ? 'Solicitud segura' : 'Secure request' }}</span>
        <h2 :id="`${formId}-title`">{{ localized(definition.title, locale) }}</h2>
        <p class="lede">{{ localized(definition.description, locale) }}</p>
        <p class="form-note">{{ locale === 'es' ? 'No envíes contraseñas, claves API, credenciales ni datos completos de pago.' : 'Do not submit passwords, API keys, credentials or complete payment details.' }}</p>
      </div>

      <form class="form-card" novalidate @submit.prevent="submit">
        <div v-if="Object.keys(errors).length" ref="errorSummary" class="error-summary" role="alert" tabindex="-1">
          <strong>{{ locale === 'es' ? 'Revisa los campos indicados.' : 'Review the highlighted fields.' }}</strong>
          <ul><li v-for="(message, key) in errors" :key="key">{{ message }}</li></ul>
        </div>

        <div class="form-grid">
          <FormField
            v-for="formField in definition.fields"
            :key="formField.key"
            :form-id="definition.id"
            :field="formField"
            :locale="locale"
            :model-value="values[formField.key] ?? ''"
            :error="errors[formField.key]"
            @update:model-value="values[formField.key] = $event"
          />
        </div>

        <label class="honeypot" aria-hidden="true">
          Leave this field blank
          <input v-model="honeypot" name="company_website_confirmation" tabindex="-1" autocomplete="off" />
        </label>

        <div class="stack consent-box">
          <BaseCheckbox v-model="serviceContact" name="service_contact" :required="definition.serviceContactRequired">
            {{ locale === 'es' ? 'Autorizo a Klyrow a contactarme para procesar esta solicitud.' : 'I authorize Klyrow to contact me to process this request.' }}
          </BaseCheckbox>
          <BaseCheckbox
            v-if="definition.marketingConsentAvailable || definition.marketingConsentRequired"
            v-model="marketingConsent"
            name="marketing_consent"
            :required="definition.marketingConsentRequired"
          >
            {{ locale === 'es' ? 'Quiero recibir novedades de producto y marketing. Puedo retirar este consentimiento.' : 'I want product and marketing updates. I can withdraw this consent.' }}
          </BaseCheckbox>
        </div>

        <div class="cluster form-actions">
          <BaseButton type="submit" :disabled="status === 'submitting'">
            {{ status === 'submitting' ? (locale === 'es' ? 'Enviando…' : 'Submitting…') : (locale === 'es' ? 'Enviar solicitud' : 'Submit request') }}
          </BaseButton>
          <span class="form-privacy">{{ locale === 'es' ? 'La solicitud usa un identificador de idempotencia y una referencia operativa.' : 'The request uses an idempotency key and operational reference.' }}</span>
        </div>

        <FormStatus :status="status" :locale="locale" :message="statusMessage" :reference="submissionReference" />
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Locale, ProblemResponse } from '@klyrow/contracts'
import { getFormDefinition, localized } from '../../data/form-registry'

type FormValue = string | boolean
interface ConfigResponse { data: { csrf_token: string } }
interface AcceptedResponse { request_id: string; submission_id: string; status: 'accepted'; duplicate: boolean; next_action: string; received_at: string }

const props = defineProps<{ formId: string }>()
const route = useRoute()
const { locale } = useLocale()
const definition = computed(() => getFormDefinition(props.formId))
const values = reactive<Record<string, FormValue>>({})
const errors = reactive<Record<string, string>>({})
const serviceContact = ref(false)
const marketingConsent = ref(false)
const honeypot = ref('')
const status = ref<'idle' | 'submitting' | 'accepted' | 'error'>('idle')
const statusMessage = ref('')
const submissionReference = ref<string>()
const errorSummary = ref<HTMLElement | null>(null)
const startedAt = ref(new Date().toISOString())
let idempotencyKey = ''

watchEffect(() => {
  for (const formField of definition.value?.fields ?? []) {
    if (!(formField.key in values)) values[formField.key] = formField.kind === 'checkbox' ? false : ''
  }
})

const message = (en: string, es: string) => (locale.value === 'es' ? es : en)
const getString = (key: string) => (typeof values[key] === 'string' ? values[key] : '')
const clearErrors = () => { for (const key of Object.keys(errors)) delete errors[key] }

const validate = () => {
  clearErrors()
  const current = definition.value
  if (!current) return false
  for (const formField of current.fields) {
    const value = values[formField.key]
    if (formField.required && (value === '' || value === false || value === undefined)) {
      errors[formField.key] = message(`${localized(formField.label, 'en')} is required.`, `El campo ${localized(formField.label, 'es')} es obligatorio.`)
    }
    if (formField.kind === 'email' && typeof value === 'string' && value && !/^\S+@\S+\.\S+$/.test(value)) {
      errors[formField.key] = message('Enter a valid email address.', 'Ingresa un correo válido.')
    }
  }
  if (current.serviceContactRequired && !serviceContact.value) errors.service_contact = message('Service-contact authorization is required.', 'La autorización de contacto es obligatoria.')
  if (current.marketingConsentRequired && !marketingConsent.value) errors.marketing_consent = message('Marketing consent is required for this subscription.', 'El consentimiento de marketing es obligatorio para esta suscripción.')
  return Object.keys(errors).length === 0
}

const problemFromError = (error: unknown): ProblemResponse | undefined => {
  if (!error || typeof error !== 'object' || !('data' in error)) return undefined
  const data = (error as { data?: unknown }).data
  if (!data || typeof data !== 'object' || !('code' in data) || !('detail' in data)) return undefined
  return data as ProblemResponse
}

const createIdempotencyKey = () => {
  if (idempotencyKey) return idempotencyKey
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`
  idempotencyKey = `idem_${random.replaceAll('-', '')}`
  return idempotencyKey
}

const submit = async () => {
  const current = definition.value
  if (!current) return
  if (!validate()) {
    status.value = 'error'
    statusMessage.value = message('Review the highlighted fields.', 'Revisa los campos indicados.')
    await nextTick()
    errorSummary.value?.focus()
    return
  }

  status.value = 'submitting'
  statusMessage.value = message('Submitting the request securely.', 'Enviando la solicitud de forma segura.')
  submissionReference.value = undefined

  try {
    const config = await $fetch<ConfigResponse>('/api/v1/public/config')
    const contactKeys = new Set(['first_name', 'last_name', 'email', 'phone', 'company', 'job_title', 'country'])
    const fields = Object.fromEntries(Object.entries(values).filter(([key]) => !contactKeys.has(key)))
    const body = {
      form_id: current.id,
      form_version: current.version,
      locale: locale.value as Locale,
      submitted_at_client: new Date().toISOString(),
      page: {
        path: route.path,
        referrer: import.meta.client ? document.referrer : '',
        utm_source: String(route.query.utm_source ?? ''),
        utm_medium: String(route.query.utm_medium ?? ''),
        utm_campaign: String(route.query.utm_campaign ?? ''),
        utm_term: String(route.query.utm_term ?? ''),
        utm_content: String(route.query.utm_content ?? ''),
      },
      contact: {
        first_name: getString('first_name'), last_name: getString('last_name'), email: getString('email'),
        phone: getString('phone'), company: getString('company'), job_title: getString('job_title'), country: getString('country'),
      },
      consent: { service_contact: serviceContact.value, marketing: marketingConsent.value, policy_version: 'website-privacy-v1' },
      fields,
      anti_abuse: { honeypot: honeypot.value, started_at: startedAt.value, captcha_token: '' },
    }
    const response = await $fetch<AcceptedResponse>(current.endpoint, {
      method: 'POST',
      headers: { 'Idempotency-Key': createIdempotencyKey(), 'X-CSRF-Token': config.data.csrf_token },
      body,
    })
    status.value = 'accepted'
    statusMessage.value = localized(current.success, locale.value)
    submissionReference.value = response.submission_id
    idempotencyKey = ''
  } catch (error: unknown) {
    const problem = problemFromError(error)
    status.value = 'error'
    statusMessage.value = problem?.detail ?? message('The service is temporarily unavailable. Your non-sensitive values were kept so you can retry.', 'El servicio no está disponible temporalmente. Conservamos los valores no sensibles para que puedas reintentar.')
    submissionReference.value = problem?.request_id
  }
}
</script>

<style scoped>
.form-section { background: linear-gradient(145deg, rgb(108 92 231 / 9%), rgb(42 210 201 / 8%)); }
.form-layout { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(2rem, 6vw, 6rem); align-items: start; }
.form-intro { position: sticky; top: 7rem; }
.form-card { display: grid; gap: 1.5rem; padding: clamp(1.25rem, 4vw, 2.5rem); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); background: var(--surface-primary); box-shadow: var(--shadow-card); }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.form-field:has(textarea), .form-field:has(.checkbox) { grid-column: 1 / -1; }
.consent-box { padding: 1rem; border-radius: var(--radius-md); background: var(--surface-secondary); }
.form-note, .form-privacy { color: var(--text-secondary); font-size: .92rem; }
.form-actions { align-items: center; }
.error-summary { padding: 1rem; border: 1px solid var(--danger); border-radius: var(--radius-md); background: color-mix(in srgb, var(--danger) 8%, white); }
.error-summary ul { margin-bottom: 0; }
.honeypot { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
@media (max-width: 50rem) { .form-layout, .form-grid { grid-template-columns: 1fr; } .form-intro { position: static; } }
</style>
