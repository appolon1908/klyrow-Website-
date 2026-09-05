import type { Locale } from '@klyrow/contracts'

// Public marketing content only. This catalog must never model account,
// session, tenant-authority, billing-ledger, or provider-delivery state.
export type MarketingPageKind =
  | 'home'
  | 'company'
  | 'pricing'
  | 'form'
  | 'solution'
  | 'feature'
  | 'integration'
  | 'developer'
  | 'resource'

export interface MarketingPageContent {
  id: string
  locale: Locale
  path: string
  kind: MarketingPageKind
  eyebrow: string
  title: string
  summary: string
  points: [string, string, string]
  steps: [string, string, string]
  related: string[]
  primaryCta: { label: string; target: string }
  secondaryCta?: { label: string; target: string } | undefined
  formId?: string | undefined
}
