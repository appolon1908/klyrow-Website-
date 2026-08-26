import type { ApiOperationDefinition } from '@klyrow/contracts'

const operation = (operationId: string, method: ApiOperationDefinition['method'], path: string, requiresIdempotency = false): ApiOperationDefinition => ({ operationId, method, path, requiresIdempotency })

export const apiOperations: ApiOperationDefinition[] = [
  operation('getHealth', 'GET', '/api/v1/health'),
  operation('getReadiness', 'GET', '/api/v1/ready'),
  operation('getPublicConfig', 'GET', '/api/v1/public/config'),
  operation('getNavigation', 'GET', '/api/v1/public/navigation'),
  operation('getFeatures', 'GET', '/api/v1/public/features'),
  operation('getPricing', 'GET', '/api/v1/public/pricing'),
  operation('getLegalDocuments', 'GET', '/api/v1/public/legal-documents'),
  operation('getLegalDocument', 'GET', '/api/v1/public/legal-documents/:slug'),
  operation('getCookieConfig', 'GET', '/api/v1/consent/cookies/config'),
  operation('getCookiePreferences', 'GET', '/api/v1/consent/cookies/current'),
  operation('updateCookiePreferences', 'PUT', '/api/v1/consent/cookies', true),
  operation('resetCookiePreferences', 'POST', '/api/v1/consent/cookies/reset', true),
  operation('requestDemo', 'POST', '/api/v1/leads/demo', true),
  operation('contactSales', 'POST', '/api/v1/leads/sales', true),
  operation('requestPricing', 'POST', '/api/v1/leads/pricing', true),
  operation('developerInterest', 'POST', '/api/v1/leads/developer-interest', true),
  operation('partnerApplication', 'POST', '/api/v1/leads/partner-application', true),
  operation('migrationConsultation', 'POST', '/api/v1/leads/migration-consultation', true),
  operation('dpaRequest', 'POST', '/api/v1/leads/dpa-request', true),
  operation('securityConsultation', 'POST', '/api/v1/leads/security-consultation', true),
  operation('supportContact', 'POST', '/api/v1/support/contact', true),
  operation('abuseReport', 'POST', '/api/v1/abuse/report', true),
  operation('securityReport', 'POST', '/api/v1/security/report', true),
  operation('newsletterSubscription', 'POST', '/api/v1/subscriptions/newsletter', true),
  operation('subprocessorUpdates', 'POST', '/api/v1/subscriptions/subprocessor-updates', true),
  operation('legalUpdates', 'POST', '/api/v1/subscriptions/legal-updates', true),
  operation('privacyRequest', 'POST', '/api/v1/privacy/requests', true),
  operation('privacyRequestStatus', 'GET', '/api/v1/privacy/requests/:publicToken'),
  operation('privacyOptOut', 'POST', '/api/v1/privacy/opt-out', true),
  operation('pricingEstimate', 'POST', '/api/v1/tools/pricing-estimate', true),
  operation('domainReadiness', 'POST', '/api/v1/tools/domain-readiness', true),
  operation('apiSandbox', 'POST', '/api/v1/tools/api-sandbox', true),
  operation('migrationPlan', 'POST', '/api/v1/tools/migration-plan', true),
  operation('contentSearch', 'GET', '/api/v1/tools/content-search'),
  operation('getOpenApi', 'GET', '/api/v1/openapi'),
]

export const operationByPath = new Map(apiOperations.map((item) => [`${item.method} ${item.path}`, item]))
