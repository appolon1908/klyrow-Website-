import type { Locale } from '@klyrow/contracts'
import { getMarketingPages } from '../../content'
import { ApiProblem } from '../errors/api-problem'

export const pricingEstimate = (input: Record<string, unknown>, mode: string) => ({
  status: mode === 'configured' ? 'estimate_requires_approved_config' : 'configuration_required',
  non_binding: true,
  inputs_received: Object.keys(input).sort(),
  next_action: 'pricing-consultation',
})

export const domainReadinessFixture = (input: Record<string, unknown>) => {
  const domain = typeof input.domain === 'string' ? input.domain.trim().toLowerCase() : ''
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new ApiProblem(422, 'VALIDATION_ERROR', 'Provide a valid domain name.')
  return { domain, status: 'fixture_only', checks: { mx: 'not_run', spf: 'not_run', dmarc: 'not_run' }, guidance: 'DNS execution is enabled in the interactive-tools branch.' }
}

export const apiSandboxFixture = (input: Record<string, unknown>) => ({ status: 'simulated', sent: false, request: input, response: { id: 'test_message', state: 'accepted_fixture' } })
export const migrationPlanFixture = (input: Record<string, unknown>) => ({ status: 'draft', inputs_received: Object.keys(input).sort(), phases: ['inventory', 'domain-readiness', 'sandbox-validation', 'restricted-cutover', 'reconciliation'] })
export const searchPublicContent = (query: string, locale: Locale) => {
  const normalized = query.trim().toLowerCase()
  if (normalized.length < 2) return []
  return getMarketingPages(locale)
    .filter((page) => `${page.title} ${page.summary} ${page.points.join(' ')}`.toLowerCase().includes(normalized))
    .slice(0, 10)
    .map(({ id, path, title, summary }) => ({ id, path: locale === 'es' ? (path === '/' ? '/es' : `/es${path}`) : path, title, summary }))
}
