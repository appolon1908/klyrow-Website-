import { z } from 'zod'

export const localeInputSchema = z.enum(['en', 'es']).default('en')
export const pageAttributionSchema = z.object({
  path: z.string().startsWith('/').max(300),
  referrer: z.string().max(1000).default(''),
  utm_source: z.string().max(120).default(''),
  utm_medium: z.string().max(120).default(''),
  utm_campaign: z.string().max(160).default(''),
  utm_term: z.string().max(160).default(''),
  utm_content: z.string().max(160).default(''),
})
export const contactSchema = z.object({
  first_name: z.string().trim().max(100).default(''),
  last_name: z.string().trim().max(100).default(''),
  email: z.email().max(254).transform((value) => value.trim().toLowerCase()),
  phone: z.string().trim().max(40).default(''),
  company: z.string().trim().max(180).default(''),
  job_title: z.string().trim().max(140).default(''),
  country: z.string().trim().max(100).default(''),
})
export const consentInputSchema = z.object({
  service_contact: z.boolean(),
  marketing: z.boolean().default(false),
  policy_version: z.string().min(1).max(100),
})
export const antiAbuseSchema = z.object({
  honeypot: z.string().max(200).default(''),
  started_at: z.iso.datetime(),
  captcha_token: z.string().max(4000).default(''),
})

export const publicSubmissionSchema = z.object({
  form_id: z.string().min(1).max(100),
  form_version: z.string().min(1).max(20).default('1'),
  locale: localeInputSchema,
  submitted_at_client: z.iso.datetime(),
  page: pageAttributionSchema,
  contact: contactSchema,
  consent: consentInputSchema,
  fields: z.record(z.string(), z.unknown()).default({}),
  anti_abuse: antiAbuseSchema,
})

export const cookiePreferencesSchema = z.object({
  necessary: z.literal(true),
  preferences: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  version: z.string().min(1).max(60),
})

export const toolInputSchema = z.record(z.string(), z.unknown())
export type PublicSubmissionInput = z.infer<typeof publicSubmissionSchema>
export type CookiePreferencesInput = z.infer<typeof cookiePreferencesSchema>
