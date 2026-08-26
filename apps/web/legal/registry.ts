import type { LegalDocumentDefinition, Locale } from '@klyrow/contracts'
import type { BilingualText, LegalDocumentContent, LegalDocumentSource, LegalSectionSource } from './schema'

const t = (en: string, es: string): BilingualText => ({ en, es })
const section = (id: string, enTitle: string, esTitle: string, paragraphs: Array<[string, string]>): LegalSectionSource => ({
  id,
  title: t(enTitle, esTitle),
  paragraphs: paragraphs.map(([en, es]) => t(en, es)),
})

const sources: LegalDocumentSource[] = [
  {
    id: 'legal-hub', path: '/legal', title: t('Legal and trust center', 'Centro legal y de confianza'),
    summary: t('Find Klyrow’s draft legal, privacy, security and service documents in one place.', 'Consulta en un solo lugar los borradores legales, de privacidad, seguridad y servicio de Klyrow.'),
    owner: 'legal', related: ['privacy', 'terms', 'acceptable-use', 'cookies', 'anti-spam', 'data-processing-addendum', 'subprocessors', 'security-disclosure', 'accessibility', 'service-support-policy', 'copyright-trademark'],
    sections: [
      section('status', 'Document status', 'Estado de los documentos', [
        ['These documents are implementation-ready templates, not a representation that legal review has been completed.', 'Estos documentos son plantillas listas para implementación; no representan que la revisión legal haya concluido.'],
        ['Production publication requires verified operating-entity facts, approved contact channels and a recorded counsel decision.', 'La publicación en producción requiere datos verificados de la entidad operadora, canales de contacto aprobados y una decisión legal registrada.'],
      ]),
      section('navigation', 'How to use this center', 'Cómo usar este centro', [
        ['Use the related-document links to understand the policy that applies to privacy, service use, messaging or security reporting.', 'Usa los enlaces relacionados para comprender la política aplicable a privacidad, uso del servicio, mensajería o reportes de seguridad.'],
      ]),
    ],
  },
  {
    id: 'privacy', path: '/privacy', title: t('Privacy notice', 'Aviso de privacidad'),
    summary: t('Explains the categories of data Klyrow may process, why it is used and how verified requests are handled.', 'Explica las categorías de datos que Klyrow puede procesar, para qué se usan y cómo se atienden solicitudes verificadas.'),
    owner: 'privacy', related: ['cookies', 'data-processing-addendum', 'subprocessors'], formId: 'privacy-request',
    sections: [
      section('scope', 'Scope and roles', 'Alcance y roles', [
        ['This draft distinguishes website visitor data, customer-account data, message metadata and content submitted through Klyrow services.', 'Este borrador distingue los datos de visitantes, cuentas de clientes, metadatos de mensajes y contenido enviado mediante los servicios de Klyrow.'],
        ['The final notice must identify when Klyrow acts as controller, processor or service provider and name the applicable operating entity.', 'El aviso final debe identificar cuándo Klyrow actúa como responsable, encargado o proveedor de servicios y nombrar la entidad aplicable.'],
      ]),
      section('collection', 'Information and purposes', 'Información y finalidades', [
        ['Klyrow may process contact, account, authentication, usage, device, support, consent and delivery-event information needed to provide and secure the service.', 'Klyrow puede procesar información de contacto, cuenta, autenticación, uso, dispositivo, soporte, consentimiento y eventos de entrega necesaria para prestar y proteger el servicio.'],
        ['Marketing preferences are kept separate from service-contact authorization. Sensitive values should never be submitted through public forms.', 'Las preferencias de marketing se mantienen separadas de la autorización de contacto de servicio. Nunca deben enviarse valores sensibles mediante formularios públicos.'],
      ]),
      section('sharing-retention', 'Sharing, retention and safeguards', 'Compartición, retención y salvaguardas', [
        ['Approved providers and subprocessors may receive the minimum information required for hosting, delivery, security, support or analytics that has been enabled.', 'Los proveedores y subprocesadores aprobados pueden recibir la información mínima necesaria para alojamiento, entrega, seguridad, soporte o analítica habilitada.'],
        ['Retention periods must be configured by data category and legal purpose; deletion requests are verified and coordinated across systems rather than executed blindly from the website.', 'Los plazos de retención deben configurarse por categoría y finalidad; las solicitudes de eliminación se verifican y coordinan entre sistemas, no se ejecutan automáticamente desde el sitio.'],
      ]),
      section('rights', 'Choices and requests', 'Opciones y solicitudes', [
        ['Depending on location and relationship, people may request access, correction, deletion, portability, restriction, objection or an applicable opt-out.', 'Según la ubicación y la relación, las personas pueden solicitar acceso, corrección, eliminación, portabilidad, limitación, oposición o una exclusión aplicable.'],
        ['Klyrow may request reasonable verification and keeps a privacy-safe reference for status updates.', 'Klyrow puede solicitar una verificación razonable y conserva una referencia segura para actualizaciones de estado.'],
      ]),
    ],
  },
  {
    id: 'terms', path: '/terms', title: t('Terms of service', 'Términos del servicio'),
    summary: t('Defines the draft commercial and operational conditions for using Klyrow services.', 'Define las condiciones comerciales y operativas preliminares para usar los servicios de Klyrow.'),
    owner: 'legal', related: ['acceptable-use', 'service-support-policy', 'privacy'], requiresAcceptance: true,
    sections: [
      section('accounts', 'Accounts and authority', 'Cuentas y autoridad', [
        ['Customers must provide accurate registration information, protect credentials and ensure users have authority to act for the organization.', 'Los clientes deben proporcionar información correcta, proteger credenciales y asegurar que sus usuarios tengan autoridad para actuar por la organización.'],
      ]),
      section('service', 'Service use and changes', 'Uso y cambios del servicio', [
        ['Use is subject to plan limits, technical documentation, acceptable-use controls and verified sender requirements.', 'El uso está sujeto a límites del plan, documentación técnica, controles de uso aceptable y requisitos de remitente verificado.'],
        ['Material service or policy changes require the notice process defined in the final approved terms.', 'Los cambios materiales del servicio o políticas requieren el proceso de aviso definido en los términos finales aprobados.'],
      ]),
      section('fees-risk', 'Fees, suspension and risk allocation', 'Tarifas, suspensión y distribución de riesgos', [
        ['Approved order forms and price schedules control fees; no public estimate is binding unless expressly approved.', 'Los formularios de pedido y listas de precios aprobados controlan las tarifas; ninguna estimación pública es vinculante salvo aprobación expresa.'],
        ['Klyrow may investigate or suspend unsafe, unlawful or abusive use, subject to the final agreement and applicable law.', 'Klyrow puede investigar o suspender usos inseguros, ilícitos o abusivos, sujeto al acuerdo final y la ley aplicable.'],
      ]),
    ],
  },
  {
    id: 'acceptable-use', path: '/acceptable-use', title: t('Acceptable use policy', 'Política de uso aceptable'),
    summary: t('Describes prohibited and restricted activity across sending, integrations and account access.', 'Describe actividades prohibidas y restringidas en envíos, integraciones y acceso a cuentas.'),
    owner: 'legal', related: ['anti-spam', 'terms', 'security-disclosure'],
    sections: [
      section('prohibited', 'Prohibited activity', 'Actividad prohibida', [
        ['Do not use Klyrow for unlawful content, fraud, phishing, malware, harassment, credential theft or attempts to bypass provider, consent or safety controls.', 'No uses Klyrow para contenido ilícito, fraude, suplantación, malware, acoso, robo de credenciales o intentos de eludir controles de proveedor, consentimiento o seguridad.'],
      ]),
      section('lists', 'Recipients and data sources', 'Destinatarios y fuentes de datos', [
        ['Purchased, scraped or improperly obtained recipient lists are not permitted for marketing traffic. Customers must maintain evidence supporting the purpose of each communication.', 'Las listas compradas, extraídas o obtenidas indebidamente no se permiten para tráfico de marketing. Los clientes deben conservar evidencia que respalde la finalidad de cada comunicación.'],
      ]),
      section('enforcement', 'Investigation and enforcement', 'Investigación y aplicación', [
        ['Klyrow may rate-limit, quarantine, suspend credentials or accounts and preserve evidence while investigating potential abuse.', 'Klyrow puede limitar, poner en cuarentena, suspender credenciales o cuentas y conservar evidencia durante una investigación de posible abuso.'],
      ]),
    ],
  },
  {
    id: 'cookies', path: '/cookies', title: t('Cookie and storage notice', 'Aviso de cookies y almacenamiento'),
    summary: t('Explains first-party storage, optional analytics and how choices can be changed.', 'Explica el almacenamiento propio, la analítica opcional y cómo cambiar las preferencias.'),
    owner: 'privacy', related: ['privacy', 'legal-hub'],
    sections: [
      section('categories', 'Technology categories', 'Categorías tecnológicas', [
        ['Necessary technologies support security, request integrity and preference storage. Preference, analytics and marketing technologies remain optional when consent is required.', 'Las tecnologías necesarias respaldan seguridad, integridad de solicitudes y almacenamiento de preferencias. Las de preferencias, analítica y marketing son opcionales cuando se requiere consentimiento.'],
      ]),
      section('controls', 'Your controls', 'Tus controles', [
        ['Visitors can accept all, reject non-essential technologies, customize categories, revisit settings and withdraw a prior choice.', 'Los visitantes pueden aceptar todo, rechazar tecnologías no esenciales, personalizar categorías, revisar ajustes y retirar una elección previa.'],
        ['Configured Global Privacy Control signals can disable applicable optional categories.', 'Las señales configuradas de Global Privacy Control pueden desactivar categorías opcionales aplicables.'],
      ]),
      section('inventory', 'Current inventory', 'Inventario actual', [
        ['The cookie settings surface lists the provider, purpose, category, mechanism and expected duration for each registered technology.', 'La superficie de ajustes enumera proveedor, finalidad, categoría, mecanismo y duración prevista de cada tecnología registrada.'],
      ]),
    ],
  },
  {
    id: 'anti-spam', path: '/anti-spam', title: t('Anti-spam and messaging policy', 'Política antispam y de mensajería'),
    summary: t('Sets permission, sender-identity, unsubscribe and complaint-handling expectations.', 'Establece expectativas sobre permiso, identidad del remitente, bajas y gestión de quejas.'),
    owner: 'legal', related: ['acceptable-use', 'consent', 'privacy'], formId: 'abuse-report',
    sections: [
      section('permission', 'Permission and purpose', 'Permiso y finalidad', [
        ['Marketing messages require an appropriate permission or other documented basis and must honor topic and global preferences.', 'Los mensajes de marketing requieren permiso apropiado u otra base documentada y deben respetar preferencias temáticas y globales.'],
        ['Transactional classification must reflect the primary purpose and cannot be used to bypass marketing controls.', 'La clasificación transaccional debe reflejar la finalidad principal y no puede usarse para eludir controles de marketing.'],
      ]),
      section('identity', 'Sender identity and content', 'Identidad y contenido del remitente', [
        ['Sender information, domains, routing data and subject lines must be accurate and not deceptive.', 'La información del remitente, dominios, datos de enrutamiento y asuntos deben ser correctos y no engañosos.'],
      ]),
      section('complaints', 'Unsubscribe, complaints and enforcement', 'Bajas, quejas y aplicación', [
        ['Unsubscribe requests, hard-bounce suppression and complaints must be processed promptly and cannot be overridden by automation.', 'Las bajas, supresiones por rebote duro y quejas deben procesarse con rapidez y no pueden ser anuladas por automatización.'],
        ['Klyrow may investigate traffic, reduce rates, suspend credentials or stop a stream to protect recipients and shared infrastructure.', 'Klyrow puede investigar tráfico, reducir tasas, suspender credenciales o detener un flujo para proteger destinatarios e infraestructura compartida.'],
      ]),
    ],
  },
  {
    id: 'data-processing-addendum', path: '/data-processing-addendum', title: t('Data processing addendum', 'Anexo de procesamiento de datos'),
    summary: t('Draft terms for processing customer personal data under an approved services agreement.', 'Términos preliminares para procesar datos personales del cliente bajo un acuerdo de servicios aprobado.'),
    owner: 'privacy', related: ['privacy', 'subprocessors', 'security-disclosure'], requiresAcceptance: true, formId: 'dpa-request',
    sections: [
      section('instructions', 'Scope and instructions', 'Alcance e instrucciones', [
        ['The final DPA will define subject matter, duration, data categories, data subjects and documented processing instructions.', 'El DPA final definirá objeto, duración, categorías de datos, interesados e instrucciones documentadas de procesamiento.'],
      ]),
      section('security', 'Confidentiality and security', 'Confidencialidad y seguridad', [
        ['Authorized personnel and subprocessors must be subject to appropriate confidentiality, access and security controls.', 'El personal autorizado y los subprocesadores deben estar sujetos a controles adecuados de confidencialidad, acceso y seguridad.'],
      ]),
      section('assistance', 'Requests, incidents and transfers', 'Solicitudes, incidentes y transferencias', [
        ['The final DPA must address assistance with verified rights requests, incident notices, deletion/return and transfer safeguards where applicable.', 'El DPA final debe abordar asistencia con derechos verificados, avisos de incidentes, eliminación/devolución y salvaguardas de transferencia cuando aplique.'],
      ]),
    ],
  },
  {
    id: 'subprocessors', path: '/subprocessors', title: t('Subprocessor list', 'Lista de subprocesadores'),
    summary: t('A versioned draft registry for providers that may process customer personal data.', 'Un registro preliminar y versionado de proveedores que pueden procesar datos personales del cliente.'),
    owner: 'privacy', related: ['data-processing-addendum', 'privacy'], formId: 'subprocessor-updates',
    sections: [
      section('registry', 'Registry fields', 'Campos del registro', [
        ['The approved list will identify provider name, service purpose, processing location or region, data categories and change date.', 'La lista aprobada identificará nombre del proveedor, finalidad, ubicación o región, categorías de datos y fecha de cambio.'],
      ]),
      section('changes', 'Change notices and objections', 'Avisos de cambio y objeciones', [
        ['Customers can subscribe to material change notices. Any objection process must be defined in the approved DPA or services agreement.', 'Los clientes pueden suscribirse a avisos de cambios materiales. Todo proceso de objeción debe definirse en el DPA o acuerdo aprobado.'],
      ]),
    ],
  },
  {
    id: 'security-disclosure', path: '/security-disclosure', title: t('Security disclosure policy', 'Política de divulgación de seguridad'),
    summary: t('Provides a safe channel and expectations for reporting potential vulnerabilities.', 'Ofrece un canal seguro y expectativas para reportar posibles vulnerabilidades.'),
    owner: 'security', related: ['security', 'acceptable-use'], formId: 'security-report',
    sections: [
      section('safe-reporting', 'Good-faith reporting', 'Reporte de buena fe', [
        ['Researchers should avoid privacy violations, service disruption, social engineering, data destruction and access beyond what is necessary to demonstrate the issue.', 'Los investigadores deben evitar violaciones de privacidad, interrupciones, ingeniería social, destrucción de datos y acceso más allá de lo necesario para demostrar el problema.'],
      ]),
      section('submission', 'What to include', 'Qué incluir', [
        ['Provide affected surface, impact, reproducible steps and a safe way to contact the reporter. Do not include credentials or unnecessary customer data.', 'Incluye superficie afectada, impacto, pasos reproducibles y una vía segura de contacto. No incluyas credenciales ni datos innecesarios de clientes.'],
      ]),
      section('response', 'Response process', 'Proceso de respuesta', [
        ['Klyrow will triage reports, coordinate remediation and communicate status when feasible. Timelines and reward programs are not promised unless separately published.', 'Klyrow analizará reportes, coordinará remediación y comunicará estado cuando sea posible. No se prometen plazos ni recompensas salvo publicación separada.'],
      ]),
    ],
  },
  {
    id: 'accessibility', path: '/accessibility', title: t('Accessibility statement', 'Declaración de accesibilidad'),
    summary: t('Describes Klyrow’s accessibility goals, testing approach and feedback route.', 'Describe los objetivos de accesibilidad, el enfoque de pruebas y el canal de comentarios de Klyrow.'),
    owner: 'support', related: ['service-support-policy', 'legal-hub'], formId: 'support-contact',
    sections: [
      section('commitment', 'Design commitment', 'Compromiso de diseño', [
        ['Klyrow aims to support keyboard operation, visible focus, meaningful structure, sufficient contrast, reduced motion and responsive zoom.', 'Klyrow busca admitir uso por teclado, foco visible, estructura significativa, contraste suficiente, movimiento reducido y zoom adaptable.'],
      ]),
      section('testing', 'Testing and limitations', 'Pruebas y limitaciones', [
        ['Automated and manual checks are part of release certification. Any known limitation should be documented rather than hidden behind a general compliance claim.', 'Las comprobaciones automáticas y manuales forman parte de la certificación. Toda limitación conocida debe documentarse en lugar de ocultarse tras una afirmación general.'],
      ]),
      section('feedback', 'Accessibility feedback', 'Comentarios de accesibilidad', [
        ['Use the support form to report a barrier, affected page, assistive technology and preferred contact method without sharing sensitive credentials.', 'Usa el formulario de soporte para reportar una barrera, página afectada, tecnología de asistencia y contacto preferido sin compartir credenciales sensibles.'],
      ]),
    ],
  },
  {
    id: 'service-support-policy', path: '/service-support-policy', title: t('Service and support policy', 'Política de servicio y soporte'),
    summary: t('Draft support channels, priority definitions and customer responsibilities.', 'Canales, prioridades y responsabilidades de soporte en versión preliminar.'),
    owner: 'support', related: ['terms', 'accessibility'], formId: 'support-contact',
    sections: [
      section('channels', 'Support channels', 'Canales de soporte', [
        ['Approved plans may include portal, email or scheduled support channels. Public forms are for intake and do not expose internal credentials or administrative access.', 'Los planes aprobados pueden incluir portal, correo o soporte programado. Los formularios públicos son de recepción y no exponen credenciales ni acceso administrativo.'],
      ]),
      section('priority', 'Priority and response targets', 'Prioridad y objetivos de respuesta', [
        ['The final policy will define severity criteria and response targets by plan. Draft examples are not contractual commitments.', 'La política final definirá criterios de severidad y objetivos de respuesta por plan. Los ejemplos preliminares no son compromisos contractuales.'],
      ]),
      section('customer-role', 'Customer responsibilities', 'Responsabilidades del cliente', [
        ['Customers should provide request IDs, timestamps and safe reproduction details, maintain authorized contacts and follow incident communication instructions.', 'Los clientes deben proporcionar IDs de solicitud, fechas y detalles seguros, mantener contactos autorizados y seguir instrucciones de incidentes.'],
      ]),
    ],
  },
  {
    id: 'copyright-trademark', path: '/copyright-trademark', title: t('Copyright and trademark notice', 'Aviso de derechos de autor y marcas'),
    summary: t('Explains ownership, permitted references and reporting of intellectual-property concerns.', 'Explica propiedad, referencias permitidas y reporte de inquietudes de propiedad intelectual.'),
    owner: 'legal', related: ['terms', 'acceptable-use'],
    sections: [
      section('ownership', 'Klyrow materials', 'Materiales de Klyrow', [
        ['Website copy, original graphics, software and brand elements are protected to the extent provided by applicable law and license terms.', 'Los textos, gráficos originales, software y elementos de marca están protegidos en la medida prevista por la ley y las licencias aplicables.'],
      ]),
      section('third-party', 'Third-party rights', 'Derechos de terceros', [
        ['Third-party product names and marks belong to their owners. References describe integrations or compatibility and do not imply sponsorship unless stated.', 'Los nombres y marcas de terceros pertenecen a sus titulares. Las referencias describen integraciones o compatibilidad y no implican patrocinio salvo indicación.'],
      ]),
      section('reports', 'Reporting concerns', 'Reporte de inquietudes', [
        ['A final notice process must include the operating entity, required information and a verified contact route for copyright or trademark concerns.', 'El proceso final debe incluir la entidad operadora, información requerida y un canal verificado para inquietudes de derechos o marcas.'],
      ]),
    ],
  },
]

const localize = (value: BilingualText, locale: Locale) => value[locale]
const toDocument = (source: LegalDocumentSource, locale: Locale): LegalDocumentContent => {
  const canonicalPath = locale === 'es' ? `/es${source.path}` : source.path
  const base: LegalDocumentContent = {
    id: source.id,
    slug: source.path.replace(/^\//, ''),
    locale,
    title: localize(source.title, locale),
    summary: localize(source.summary, locale),
    version: 'draft-2026-08-26',
    status: 'draft',
    lastUpdated: '2026-08-26',
    owner: source.owner,
    canonicalPath,
    indexable: false,
    requiresAcceptance: Boolean(source.requiresAcceptance),
    relatedDocuments: source.related,
    contactRoute: locale === 'es' ? '/es/contact' : '/contact',
    sections: source.sections.map((entry) => ({
      id: entry.id,
      title: localize(entry.title, locale),
      paragraphs: entry.paragraphs.map((paragraph) => localize(paragraph, locale)),
    })),
  }
  return source.formId ? { ...base, formId: source.formId } : base
}

export const legalDocuments = sources.flatMap((source) => [toDocument(source, 'en'), toDocument(source, 'es')])
export const getLegalDocuments = (locale: Locale) => legalDocuments.filter((document) => document.locale === locale)
export const getLegalDocument = (locale: Locale, path: string) => {
  const canonicalPath = locale === 'es' ? `/es${path}` : path
  return legalDocuments.find((document) => document.locale === locale && document.canonicalPath === canonicalPath)
}
export const getLegalDocumentBySlug = (locale: Locale, slug: string) => legalDocuments.find((document) => document.locale === locale && document.slug === slug)

export const conditionalLegalTemplates = [
  { id: 'refund-cancellation', path: '/refund-cancellation', enabled: false },
  { id: 'service-level-agreement', path: '/service-level-agreement', enabled: false },
  { id: 'children-privacy', path: '/children-privacy', enabled: false },
  { id: 'ai-transparency', path: '/ai-transparency', enabled: false },
] as const
