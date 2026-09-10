import { resolveMx, resolveTxt } from 'node:dns/promises'
import type { Locale } from '@klyrow/contracts'
import { getMarketingPages } from '../../content'
import { ApiProblem } from '../errors/api-problem'

interface PricingConfiguration {
  currency: string
  transactionalPerThousand: number
  marketingPerThousand: number
  profilePerThousand: number
  seatMonthly: number
  minimumMonthly: number
}

export const parsePricingConfiguration = (raw: string): PricingConfiguration | null => {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<PricingConfiguration>
    if (!value.currency || !['transactionalPerThousand', 'marketingPerThousand', 'profilePerThousand', 'seatMonthly', 'minimumMonthly'].every((key) => typeof value[key as keyof PricingConfiguration] === 'number')) return null
    return value as PricingConfiguration
  } catch { return null }
}
const numberInput = (input: Record<string, unknown>, key: string) => Math.max(0, Math.min(1000000000, Number(input[key] ?? 0) || 0))
export const pricingEstimate = (input: Record<string, unknown>, mode: string, rawConfig = '') => {
  const config = mode === 'configured' ? parsePricingConfiguration(rawConfig) : null
  if (!config) return { status: 'configuration_required', non_binding: true, next_action: 'pricing-consultation' }
  const transactional = numberInput(input, 'transactional_messages')
  const marketing = numberInput(input, 'marketing_messages')
  const profiles = numberInput(input, 'profiles')
  const seats = numberInput(input, 'seats')
  const variable = (transactional / 1000) * config.transactionalPerThousand + (marketing / 1000) * config.marketingPerThousand + (profiles / 1000) * config.profilePerThousand + seats * config.seatMonthly
  const estimate = Math.max(config.minimumMonthly, variable)
  return { status: 'estimated', non_binding: true, currency: config.currency, monthly_estimate: Math.round(estimate * 100) / 100, next_action: 'pricing-consultation' }
}

export const normalizeDomain = (value: unknown) => {
  const domain = typeof value === 'string' ? value.trim().toLowerCase().replace(/\.$/, '') : ''
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new ApiProblem(422, 'VALIDATION_ERROR', 'Provide a valid domain name only.')
  return domain
}
const withTimeout = async <T>(promise: Promise<T>, milliseconds = 3500): Promise<T> => Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('dns timeout')), milliseconds))])
const cache = new Map<string, { expiresAt: number; value: unknown }>()
const txtValues = (records: string[][]) => records.map((entry) => entry.join(''))
export const inspectDomainReadiness = async (input: Record<string, unknown>) => {
  const domain = normalizeDomain(input.domain)
  const cached = cache.get(domain)
  if (cached && cached.expiresAt > Date.now()) return cached.value
  const [mxResult, rootTxtResult, dmarcResult] = await Promise.allSettled([withTimeout(resolveMx(domain)), withTimeout(resolveTxt(domain)), withTimeout(resolveTxt(`_dmarc.${domain}`))])
  const mx = mxResult.status === 'fulfilled' ? mxResult.value.sort((a, b) => a.priority - b.priority).map((entry) => ({ priority: entry.priority, exchange: entry.exchange })) : []
  const rootTxt = rootTxtResult.status === 'fulfilled' ? txtValues(rootTxtResult.value) : []
  const dmarcTxt = dmarcResult.status === 'fulfilled' ? txtValues(dmarcResult.value) : []
  const spf = rootTxt.find((entry) => entry.toLowerCase().startsWith('v=spf1')) ?? ''
  const dmarc = dmarcTxt.find((entry) => entry.toLowerCase().startsWith('v=dmarc1')) ?? ''
  const value = {
    domain,
    status: mx.length && spf && dmarc ? 'ready_for_review' : 'action_required',
    checks: {
      mx: { status: mx.length ? 'present' : 'missing', records: mx },
      spf: { status: spf ? 'present' : 'missing', record: spf },
      dmarc: { status: dmarc ? 'present' : 'missing', record: dmarc },
      dkim: { status: 'selector_required', guidance: 'Verify the exact selector issued by the configured sending service.' },
    },
    disclaimer: 'DNS readiness is educational and does not guarantee delivery or inbox placement.',
  }
  cache.set(domain, { expiresAt: Date.now() + 300000, value })
  return value
}

export const apiSandboxFixture = (input: Record<string, unknown>) => {
  const scenario = typeof input.scenario === 'string' ? input.scenario : 'accepted'
  if (!['accepted', 'deferred', 'bounced', 'complained'].includes(scenario)) throw new ApiProblem(422, 'VALIDATION_ERROR', 'Select a supported sandbox scenario.')
  return { status: 'simulated', sent: false, environment: 'sandbox_fixture', request_id: 'req_example', message: { id: 'msg_test_01', state: scenario }, events: [{ type: `message.${scenario}`, simulated: true }] }
}

export const createMigrationPlan = (input: Record<string, unknown>) => {
  const domains = Math.max(0, Math.min(10000, Number(input.domains ?? 0) || 0))
  const templates = Math.max(0, Math.min(100000, Number(input.templates ?? 0) || 0))
  const suppressions = input.suppressions_available === true
  const risks = [!domains ? 'No sending-domain inventory supplied.' : '', !suppressions ? 'Suppression data must be exported or reconciled before cutover.' : '', templates > 500 ? 'Large template inventory needs automated validation.' : ''].filter(Boolean)
  return {
    status: 'draft',
    non_binding: true,
    phases: [
      { id: 'inventory', title: 'Inventory identities, domains, streams, templates and suppressions.' },
      { id: 'readiness', title: 'Verify DNS, authentication, policy and webhook readiness.' },
      { id: 'sandbox', title: 'Replay representative traffic in a no-side-effect sandbox.' },
      { id: 'canary', title: 'Use a restricted sender, recipient and volume canary.' },
      { id: 'reconciliation', title: 'Reconcile provider, suppression and back-office evidence.' },
    ],
    risks,
    next_action: 'migration-consultation',
  }
}

export const searchPublicContent = (query: string, locale: Locale) => {
  const normalized = query.trim().toLowerCase()
  if (normalized.length < 2 || normalized.length > 120) return []
  return getMarketingPages(locale).filter((page) => `${page.title} ${page.summary} ${page.points.join(' ')}`.toLowerCase().includes(normalized)).slice(0, 10).map(({ id, path, title, summary }) => ({ id, path: locale === 'es' ? (path === '/' ? '/es' : `/es${path}`) : path, title, summary }))
}
