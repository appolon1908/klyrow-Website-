export const horizonContract = Object.freeze({
  repository: 'appolon1908-hue/SDK-repository',
  pullRequest: 73,
  commit: '7db4c6549a0a007922355090f03c082a308f3855',
  validatorCommit: 'b258cf952df3a2ef11a2ba2e0df16c7983ee2a99',
  branch: 'feature/horizon-unified-experience-v1'
})

export const klyrowDomains = Object.freeze({
  public: 'https://klyrow.com',
  publicWww: 'https://www.klyrow.com',
  application: 'https://app.klyrow.com',
  login: 'https://app.klyrow.com/auth/login',
  signup: 'https://app.klyrow.com/auth/signup',
  identity: 'https://auth.codestra.co',
  issuer: 'https://auth.codestra.co/realms/codestra',
  corporate: 'https://codestra.co',
  contact: 'https://codestra.co/contact'
})

export const applicationBoundary = Object.freeze({
  authorityRepository: 'appolon1908-hue/klyrow.com',
  marketingSurface: 'public-only',
  authentication: 'external-application-handoff',
  browserTokenStorage: 'forbidden',
  sessionAuthority: 'server-side-encrypted',
  durableIdentity: 'issuer+subject'
})

export const primaryNavigation = Object.freeze([
  { label: 'Platform', to: '/platform' },
  { label: 'Developers', to: '/developers' },
  { label: 'Security', to: '/security' },
  { label: 'Pricing', to: '/pricing' }
])

export const codestraProductNetwork = Object.freeze([
  { label: 'Codestra', href: 'https://codestra.co' },
  { label: 'Breero', href: 'https://breero.com' },
  { label: 'Beyvra', href: 'https://beyvra.com' },
  { label: 'Telnexa', href: 'https://telnexa.co' },
  { label: 'Codestra Social', href: 'https://social.codestra.co' }
])
