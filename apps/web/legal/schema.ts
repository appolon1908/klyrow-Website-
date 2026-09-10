import type { LegalDocumentDefinition, Locale } from '@klyrow/contracts'

export interface BilingualText {
  en: string
  es: string
}

export interface LegalSectionSource {
  id: string
  title: BilingualText
  paragraphs: BilingualText[]
}

export interface LegalDocumentSource {
  id: string
  path: string
  title: BilingualText
  summary: BilingualText
  owner: LegalDocumentDefinition['owner']
  sections: LegalSectionSource[]
  related: string[]
  requiresAcceptance?: boolean
  formId?: string
}

export interface LegalSectionContent {
  id: string
  title: string
  paragraphs: string[]
}

export interface LegalDocumentContent extends LegalDocumentDefinition {
  locale: Locale
  sections: LegalSectionContent[]
  formId?: string
}

export type LegalUtilityKind =
  | 'cookie-settings'
  | 'privacy-request'
  | 'privacy-status'
  | 'privacy-opt-out'
  | 'version-history'

export interface LegalUtilityRoute {
  kind: LegalUtilityKind
  path: string
  token?: string
}
