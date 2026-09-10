export interface WebsiteIntegrationMapping {
  eventType: string
  odooIntent: 'crm_lead' | 'support_ticket' | 'privacy_case' | 'security_case' | 'mailing_subscription'
  n8nIntent: 'notify_sales' | 'route_support' | 'route_privacy' | 'route_security' | 'subscription_confirmation'
  containsFreeText: boolean
}

export const websiteIntegrationMappings: WebsiteIntegrationMapping[] = [
  { eventType: 'klyrow.website.demo.requested.v1', odooIntent: 'crm_lead', n8nIntent: 'notify_sales', containsFreeText: true },
  { eventType: 'klyrow.website.sales.requested.v1', odooIntent: 'crm_lead', n8nIntent: 'notify_sales', containsFreeText: true },
  { eventType: 'klyrow.website.pricing.requested.v1', odooIntent: 'crm_lead', n8nIntent: 'notify_sales', containsFreeText: true },
  { eventType: 'klyrow.website.developer_interest.created.v1', odooIntent: 'crm_lead', n8nIntent: 'notify_sales', containsFreeText: true },
  { eventType: 'klyrow.website.partner_application.created.v1', odooIntent: 'crm_lead', n8nIntent: 'notify_sales', containsFreeText: true },
  { eventType: 'klyrow.website.migration_consultation.requested.v1', odooIntent: 'crm_lead', n8nIntent: 'notify_sales', containsFreeText: true },
  { eventType: 'klyrow.website.dpa_request.created.v1', odooIntent: 'privacy_case', n8nIntent: 'route_privacy', containsFreeText: true },
  { eventType: 'klyrow.website.security_consultation.created.v1', odooIntent: 'security_case', n8nIntent: 'route_security', containsFreeText: true },
  { eventType: 'klyrow.website.support_contact.created.v1', odooIntent: 'support_ticket', n8nIntent: 'route_support', containsFreeText: true },
  { eventType: 'klyrow.website.abuse_report.created.v1', odooIntent: 'security_case', n8nIntent: 'route_security', containsFreeText: true },
  { eventType: 'klyrow.website.security_report.created.v1', odooIntent: 'security_case', n8nIntent: 'route_security', containsFreeText: true },
  { eventType: 'klyrow.website.newsletter_subscription.requested.v1', odooIntent: 'mailing_subscription', n8nIntent: 'subscription_confirmation', containsFreeText: false },
  { eventType: 'klyrow.website.subprocessor_updates.requested.v1', odooIntent: 'mailing_subscription', n8nIntent: 'subscription_confirmation', containsFreeText: false },
  { eventType: 'klyrow.website.legal_updates.requested.v1', odooIntent: 'mailing_subscription', n8nIntent: 'subscription_confirmation', containsFreeText: false },
  { eventType: 'klyrow.website.privacy_request.created.v1', odooIntent: 'privacy_case', n8nIntent: 'route_privacy', containsFreeText: true },
  { eventType: 'klyrow.website.privacy_opt_out.created.v1', odooIntent: 'privacy_case', n8nIntent: 'route_privacy', containsFreeText: true },
]

export const getWebsiteIntegrationMapping = (eventType: string) => websiteIntegrationMappings.find((entry) => entry.eventType === eventType)
