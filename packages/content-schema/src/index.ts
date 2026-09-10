import { z } from 'zod'
import { localeSchema } from '@klyrow/contracts'
export const contentMetadataSchema = z.object({
  id: z.string(),
  locale: localeSchema,
  title: z.string(),
  summary: z.string(),
  route: z.string().startsWith('/'),
})
export type ContentMetadata = z.infer<typeof contentMetadataSchema>
