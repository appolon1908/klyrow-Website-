export interface PublicClientConfig {
  releaseSha: string
  publicBaseUrl: string
}
export const usePublicClientConfig = (): PublicClientConfig => {
  const config = useRuntimeConfig()
  return { releaseSha: config.public.releaseSha, publicBaseUrl: config.public.publicBaseUrl }
}
