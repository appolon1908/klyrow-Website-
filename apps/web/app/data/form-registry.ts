import type { Locale } from '@klyrow/contracts'

export type FormFieldKind = 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox'

export interface LocalizedText {
  en: string
  es: string
}

export interface FormOption {
  value: string
  label: LocalizedText
}

export interface FormFieldDefinition {
  key: string
  kind: FormFieldKind
  label: LocalizedText
  required?: boolean
  autocomplete?: string
  contactField?: boolean
  hint?: LocalizedText
  options?: FormOption[]
}

export interface PublicFormDefinition {
  id: string
  version: string
  endpoint: string
  title: LocalizedText
  description: LocalizedText
  fields: FormFieldDefinition[]
  serviceContactRequired: boolean
  marketingConsentRequired?: boolean
  marketingConsentAvailable?: boolean
  success: LocalizedText
}

const t = (en: string, es: string): LocalizedText => ({ en, es })
const option = (value: string, en: string, es: string): FormOption => ({ value, label: t(en, es) })
const field = (
  key: string,
  kind: FormFieldKind,
  en: string,
  es: string,
  settings: Omit<FormFieldDefinition, 'key' | 'kind' | 'label'> = {},
): FormFieldDefinition => ({ key, kind, label: t(en, es), ...settings })

const firstName = field('first_name', 'text', 'First name', 'Nombre', { required: true, autocomplete: 'given-name', contactField: true })
const lastName = field('last_name', 'text', 'Last name', 'Apellido', { required: true, autocomplete: 'family-name', contactField: true })
const email = field('email', 'email', 'Work email', 'Correo de trabajo', { required: true, autocomplete: 'email', contactField: true })
const phone = field('phone', 'tel', 'Phone', 'Teléfono', { autocomplete: 'tel', contactField: true })
const company = field('company', 'text', 'Company', 'Empresa', { autocomplete: 'organization', contactField: true })
const jobTitle = field('job_title', 'text', 'Job title', 'Cargo', { autocomplete: 'organization-title', contactField: true })
const country = field('country', 'text', 'Country or region', 'País o región', { autocomplete: 'country-name', contactField: true })
const notes = field('notes', 'textarea', 'Anything else we should know?', '¿Qué más debemos saber?', {
  hint: t('Do not submit passwords, API keys or payment data.', 'No envíes contraseñas, claves API ni datos de pago.'),
})
const common = [firstName, lastName, email, phone, company]
const volumeOptions = [
  option('under_100k', 'Under 100,000 messages', 'Menos de 100.000 mensajes'),
  option('100k_1m', '100,000 to 1 million', 'De 100.000 a 1 millón'),
  option('1m_10m', '1 to 10 million', 'De 1 a 10 millones'),
  option('over_10m', 'More than 10 million', 'Más de 10 millones'),
]

export const publicForms: PublicFormDefinition[] = [
  {
    id: 'request-demo', version: '1', endpoint: '/api/v1/leads/demo',
    title: t('Request a focused demo', 'Solicita una demostración enfocada'),
    description: t('Tell us which workflow and operating constraints matter most.', 'Cuéntanos qué flujo y controles operativos son más importantes.'),
    fields: [...common, jobTitle,
      field('use_case', 'select', 'Primary use case', 'Caso de uso principal', { required: true, options: [option('transactional', 'Transactional email', 'Correo transaccional'), option('marketing', 'Marketing automation', 'Automatización de marketing'), option('reseller', 'Agency or reseller', 'Agencia o revendedor'), option('enterprise', 'Enterprise governance', 'Gobierno empresarial')] }),
      field('monthly_volume_range', 'select', 'Expected monthly volume', 'Volumen mensual estimado', { required: true, options: volumeOptions }),
      field('current_provider', 'text', 'Current provider', 'Proveedor actual'), notes],
    serviceContactRequired: true,
    marketingConsentAvailable: true,
    success: t('Your demo request was accepted.', 'Tu solicitud de demostración fue aceptada.'),
  },
  {
    id: 'contact-sales', version: '1', endpoint: '/api/v1/leads/sales',
    title: t('Talk to sales', 'Habla con ventas'),
    description: t('Share the product areas and commercial context you want to review.', 'Comparte las áreas del producto y el contexto comercial que deseas revisar.'),
    fields: [...common, jobTitle, field('products_interested', 'text', 'Products or capabilities', 'Productos o capacidades', { required: true }), field('monthly_volume_range', 'select', 'Expected monthly volume', 'Volumen mensual estimado', { options: volumeOptions }), country, notes],
    serviceContactRequired: true, marketingConsentAvailable: true,
    success: t('Your sales request was accepted.', 'Tu solicitud de ventas fue aceptada.'),
  },
  {
    id: 'pricing-consultation', version: '1', endpoint: '/api/v1/leads/pricing',
    title: t('Request a pricing consultation', 'Solicita una consulta de precios'),
    description: t('Receive a reviewed proposal based on approved pricing configuration.', 'Recibe una propuesta revisada basada en precios aprobados.'),
    fields: [...common, field('monthly_transactional_volume', 'select', 'Transactional volume', 'Volumen transaccional', { required: true, options: volumeOptions }), field('monthly_marketing_volume', 'select', 'Marketing volume', 'Volumen de marketing', { options: volumeOptions }), field('seat_count_range', 'text', 'Expected seats', 'Usuarios estimados'), field('reseller_interest', 'checkbox', 'I am evaluating reseller capabilities', 'Estoy evaluando capacidades para revendedores'), notes],
    serviceContactRequired: true,
    success: t('Your pricing request was accepted.', 'Tu solicitud de precios fue aceptada.'),
  },
  {
    id: 'developer-interest', version: '1', endpoint: '/api/v1/leads/developer-interest',
    title: t('Start an API conversation', 'Inicia una conversación sobre la API'),
    description: t('Describe your integration and sandbox requirements.', 'Describe tu integración y necesidades de sandbox.'),
    fields: [firstName, lastName, email, company, field('primary_language', 'text', 'Primary programming language', 'Lenguaje de programación principal', { required: true }), field('integration_type', 'select', 'Integration type', 'Tipo de integración', { required: true, options: [option('api', 'REST API', 'API REST'), option('smtp', 'SMTP relay', 'Relay SMTP'), option('webhooks', 'Webhooks', 'Webhooks'), option('inbound', 'Inbound email', 'Correo entrante')] }), field('estimated_volume_range', 'select', 'Estimated volume', 'Volumen estimado', { options: volumeOptions }), notes],
    serviceContactRequired: true,
    success: t('Your developer request was accepted.', 'Tu solicitud para desarrolladores fue aceptada.'),
  },
  {
    id: 'partner-application', version: '1', endpoint: '/api/v1/leads/partner-application',
    title: t('Apply as a partner', 'Solicita ser socio'),
    description: t('Tell us how you serve customers and whether you need white-label operations.', 'Cuéntanos cómo atiendes clientes y si necesitas operaciones de marca blanca.'),
    fields: [...common, field('partner_type', 'select', 'Partner type', 'Tipo de socio', { required: true, options: [option('agency', 'Agency', 'Agencia'), option('reseller', 'Reseller', 'Revendedor'), option('technology', 'Technology partner', 'Socio tecnológico'), option('consulting', 'Consulting partner', 'Socio consultor')] }), field('customer_count_range', 'text', 'Customers managed', 'Clientes administrados'), field('website_url', 'url', 'Website', 'Sitio web'), field('white_label_interest', 'checkbox', 'White-label access is required', 'Necesitamos acceso de marca blanca'), notes],
    serviceContactRequired: true,
    success: t('Your partner application was accepted.', 'Tu solicitud de socio fue aceptada.'),
  },
  {
    id: 'migration-consultation', version: '1', endpoint: '/api/v1/leads/migration-consultation',
    title: t('Plan a migration', 'Planifica una migración'),
    description: t('Map domains, templates, suppressions and rollout timing before moving traffic.', 'Define dominios, plantillas, supresiones y tiempos antes de mover tráfico.'),
    fields: [...common, field('current_provider', 'text', 'Current provider', 'Proveedor actual', { required: true }), field('current_volume_range', 'select', 'Current monthly volume', 'Volumen mensual actual', { options: volumeOptions }), field('domains_count_range', 'text', 'Sending domains', 'Dominios de envío'), field('templates_count_range', 'text', 'Templates to migrate', 'Plantillas a migrar'), field('desired_timeline', 'text', 'Desired timeline', 'Plazo deseado'), notes],
    serviceContactRequired: true,
    success: t('Your migration request was accepted.', 'Tu solicitud de migración fue aceptada.'),
  },
  {
    id: 'support-contact', version: '1', endpoint: '/api/v1/support/contact',
    title: t('Contact Klyrow', 'Contacta a Klyrow'),
    description: t('Route a general, support, privacy or account question to the right team.', 'Envía una consulta general, de soporte, privacidad o cuenta al equipo correcto.'),
    fields: [firstName, lastName, email, company, field('category', 'select', 'Category', 'Categoría', { required: true, options: [option('general', 'General', 'General'), option('support', 'Support', 'Soporte'), option('privacy', 'Privacy', 'Privacidad'), option('account', 'Account', 'Cuenta')] }), field('subject', 'text', 'Subject', 'Asunto', { required: true }), field('message', 'textarea', 'Message', 'Mensaje', { required: true, hint: notes.hint })],
    serviceContactRequired: true,
    success: t('Your message was accepted.', 'Tu mensaje fue aceptado.'),
  },
  {
    id: 'security-consultation', version: '1', endpoint: '/api/v1/leads/security-consultation',
    title: t('Security consultation', 'Consulta de seguridad'),
    description: t('Discuss identity, tenant isolation, controls and deployment requirements.', 'Conversa sobre identidad, aislamiento, controles y requisitos de despliegue.'),
    fields: [...common, jobTitle, field('security_requirements', 'textarea', 'Security requirements', 'Requisitos de seguridad', { required: true }), field('preferred_timeline', 'text', 'Review timeline', 'Plazo de revisión'), notes],
    serviceContactRequired: true,
    success: t('Your security consultation request was accepted.', 'Tu solicitud de consulta de seguridad fue aceptada.'),
  },
  {
    id: 'security-report', version: '1', endpoint: '/api/v1/security/report',
    title: t('Report a security issue', 'Reporta un problema de seguridad'),
    description: t('Provide enough detail for triage without sending credentials or sensitive customer data.', 'Incluye detalles para el análisis sin enviar credenciales ni datos sensibles.'),
    fields: [firstName, lastName, email, company, field('vulnerability_type', 'text', 'Issue type', 'Tipo de problema', { required: true }), field('affected_url', 'text', 'Affected surface', 'Superficie afectada'), field('reproduction_steps', 'textarea', 'Reproduction steps', 'Pasos para reproducir', { required: true, hint: notes.hint })],
    serviceContactRequired: true,
    success: t('Your security report was accepted for triage.', 'Tu reporte de seguridad fue aceptado para análisis.'),
  },
  {
    id: 'abuse-report', version: '1', endpoint: '/api/v1/abuse/report',
    title: t('Report abuse', 'Reporta abuso'),
    description: t('Report unwanted or unsafe messaging with privacy-safe evidence.', 'Reporta mensajes no deseados o inseguros con evidencia segura.'),
    fields: [firstName, lastName, email, field('sender_domain', 'text', 'Sender domain', 'Dominio remitente', { required: true }), field('message_id', 'text', 'Message ID, if available', 'ID del mensaje, si está disponible'), field('abuse_type', 'select', 'Abuse type', 'Tipo de abuso', { required: true, options: [option('spam', 'Spam', 'Spam'), option('phishing', 'Phishing', 'Suplantación'), option('malware', 'Malware', 'Malware'), option('other', 'Other', 'Otro')] }), field('details', 'textarea', 'Details', 'Detalles', { required: true, hint: notes.hint })],
    serviceContactRequired: true,
    success: t('Your abuse report was accepted.', 'Tu reporte de abuso fue aceptado.'),
  },
  {
    id: 'dpa-request', version: '1', endpoint: '/api/v1/leads/dpa-request',
    title: t('Request data-processing information', 'Solicita información de procesamiento de datos'),
    description: t('Start a traceable DPA or privacy review request.', 'Inicia una solicitud trazable de DPA o revisión de privacidad.'),
    fields: [...common, country, field('request_scope', 'textarea', 'Requested scope', 'Alcance solicitado', { required: true }), notes],
    serviceContactRequired: true,
    success: t('Your DPA request was accepted.', 'Tu solicitud de DPA fue aceptada.'),
  },
  {
    id: 'privacy-request', version: '1', endpoint: '/api/v1/privacy/requests',
    title: t('Submit a privacy request', 'Envía una solicitud de privacidad'),
    description: t('Request access, correction, deletion, portability or another supported privacy action.', 'Solicita acceso, corrección, eliminación, portabilidad u otra acción compatible.'),
    fields: [firstName, lastName, email, country, field('request_type', 'select', 'Request type', 'Tipo de solicitud', { required: true, options: [option('access', 'Access', 'Acceso'), option('correction', 'Correction', 'Corrección'), option('deletion', 'Deletion', 'Eliminación'), option('portability', 'Portability', 'Portabilidad'), option('objection', 'Objection', 'Oposición'), option('other', 'Other', 'Otra')] }), field('details', 'textarea', 'Request details', 'Detalles de la solicitud', { required: true })],
    serviceContactRequired: true,
    success: t('Your privacy request was accepted.', 'Tu solicitud de privacidad fue aceptada.'),
  },
  {
    id: 'privacy-opt-out', version: '1', endpoint: '/api/v1/privacy/opt-out',
    title: t('Submit an opt-out request', 'Envía una solicitud de exclusión'),
    description: t('Record the scope of the privacy choice you want Klyrow to process.', 'Registra el alcance de la preferencia de privacidad que deseas procesar.'),
    fields: [firstName, lastName, email, country, field('scope', 'select', 'Opt-out scope', 'Alcance de exclusión', { required: true, options: [option('marketing', 'Marketing communications', 'Comunicaciones de marketing'), option('sale_share', 'Sale or sharing where applicable', 'Venta o intercambio cuando aplique'), option('sensitive_use', 'Sensitive-data use where applicable', 'Uso de datos sensibles cuando aplique')] }), field('details', 'textarea', 'Additional context', 'Contexto adicional')],
    serviceContactRequired: true,
    success: t('Your opt-out request was accepted.', 'Tu solicitud de exclusión fue aceptada.'),
  },
  {
    id: 'newsletter', version: '1', endpoint: '/api/v1/subscriptions/newsletter',
    title: t('Subscribe to Klyrow updates', 'Suscríbete a novedades de Klyrow'),
    description: t('Choose the product and operational topics you want to receive.', 'Elige los temas de producto y operación que deseas recibir.'),
    fields: [firstName, lastName, email, field('topics', 'text', 'Topics', 'Temas', { required: true }), field('frequency_preference', 'select', 'Frequency', 'Frecuencia', { options: [option('monthly', 'Monthly', 'Mensual'), option('important', 'Important updates only', 'Solo actualizaciones importantes')] })],
    serviceContactRequired: true, marketingConsentRequired: true,
    success: t('Your subscription request was accepted.', 'Tu solicitud de suscripción fue aceptada.'),
  },
  {
    id: 'subprocessor-updates', version: '1', endpoint: '/api/v1/subscriptions/subprocessor-updates',
    title: t('Subscribe to subprocessor updates', 'Suscríbete a cambios de subprocesadores'),
    description: t('Receive notices when the approved subprocessor list changes.', 'Recibe avisos cuando cambie la lista aprobada de subprocesadores.'),
    fields: [firstName, lastName, email, company], serviceContactRequired: true,
    success: t('Your update subscription was accepted.', 'Tu suscripción a actualizaciones fue aceptada.'),
  },
  {
    id: 'legal-updates', version: '1', endpoint: '/api/v1/subscriptions/legal-updates',
    title: t('Subscribe to legal updates', 'Suscríbete a cambios legales'),
    description: t('Receive notices for material policy and legal-document changes.', 'Recibe avisos sobre cambios importantes en políticas y documentos legales.'),
    fields: [firstName, lastName, email, company], serviceContactRequired: true,
    success: t('Your legal-update subscription was accepted.', 'Tu suscripción a cambios legales fue aceptada.'),
  },
]

export const formRegistry = Object.fromEntries(publicForms.map((form) => [form.id, form])) as Record<string, PublicFormDefinition>
export const getFormDefinition = (formId: string) => formRegistry[formId]
export const localized = (text: LocalizedText, locale: Locale) => text[locale]
