export interface NavigationItem {
  label: string
  path: string
  description?: string
}

export interface NavigationGroup {
  id: string
  labelKey: 'product' | 'solutions'
  items: NavigationItem[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: 'product',
    labelKey: 'product',
    items: [
      { label: 'Transactional email', path: '/features/transactional-email', description: 'Reliable operational messages.' },
      { label: 'Marketing automation', path: '/features/automation', description: 'Journeys with consent controls.' },
      { label: 'Email API', path: '/features/email-api', description: 'Developer-first delivery interfaces.' },
      { label: 'Decision ledger', path: '/features/decision-ledger', description: 'Explain why each message was sent.' },
    ],
  },
  {
    id: 'solutions',
    labelKey: 'solutions',
    items: [
      { label: 'Developers', path: '/solutions/developers' },
      { label: 'Marketing teams', path: '/solutions/marketing-teams' },
      { label: 'Agencies & resellers', path: '/solutions/agencies-resellers' },
      { label: 'Enterprise', path: '/solutions/enterprise' },
      { label: 'Odoo & automation', path: '/solutions/odoo-automation' },
    ],
  },
]

export const primaryLinks: NavigationItem[] = [
  { label: 'Integrations', path: '/integrations' },
  { label: 'Developers', path: '/developers' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Resources', path: '/resources' },
]
