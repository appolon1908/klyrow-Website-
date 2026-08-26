import { z } from 'zod'

export const configurationClass = {
  PUBLIC_SAFE: 'PUBLIC_SAFE',
  SERVER_SECRET: 'SERVER_SECRET',
  SERVER_NON_SECRET: 'SERVER_NON_SECRET',
  RELEASE_REQUIRED: 'RELEASE_REQUIRED',
  OPTIONAL_INTEGRATION: 'OPTIONAL_INTEGRATION',
} as const
export type ConfigurationClass = (typeof configurationClass)[keyof typeof configurationClass]

export const configurationCatalog = {
  publicBaseUrl: { class: configurationClass.PUBLIC_SAFE, runtimePath: 'public.publicBaseUrl' },
  releaseSha: {
    class: configurationClass.RELEASE_REQUIRED,
    runtimePath: 'public.releaseSha',
    public: true,
  },
  middlewareCredential: {
    class: configurationClass.SERVER_SECRET,
    runtimePath: 'middlewareCredential',
  },
  requestTimeoutMs: {
    class: configurationClass.SERVER_NON_SECRET,
    runtimePath: 'requestTimeoutMs',
  },
  middlewareEnabled: {
    class: configurationClass.OPTIONAL_INTEGRATION,
    runtimePath: 'middlewareEnabled',
  },
} as const

const serverRuntimeSchema = z.object({
  middlewareCredential: z.string(),
  requestTimeoutMs: z.number().int().positive(),
  middlewareEnabled: z.boolean().default(false),
  public: z.object({ releaseSha: z.string().min(1), publicBaseUrl: z.url() }),
})
export type ServerRuntimeConfig = z.infer<typeof serverRuntimeSchema>
export type PublicRuntimeConfig = ServerRuntimeConfig['public']
export const parseServerRuntimeConfig = (input: unknown): ServerRuntimeConfig =>
  serverRuntimeSchema.parse(input)
export const selectPublicRuntimeConfig = (config: ServerRuntimeConfig): PublicRuntimeConfig => ({
  ...config.public,
})
