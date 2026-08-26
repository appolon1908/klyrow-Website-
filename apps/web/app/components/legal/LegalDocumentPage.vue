<template>
  <article class="legal-document">
    <section class="section legal-hero"><div class="container legal-layout"><div class="stack"><Breadcrumbs :path="basePath" :title="document.title" /><span class="eyebrow">{{ document.locale === 'es' ? 'Centro legal' : 'Legal center' }}</span><h1>{{ document.title }}</h1><p class="lede">{{ document.summary }}</p><BaseAlert tone="warning"><strong>{{ document.locale === 'es' ? 'Borrador para revisión legal.' : 'Draft for legal review.' }}</strong> {{ document.locale === 'es' ? 'No debe presentarse como aprobado ni efectivo hasta registrar la entidad, los contactos y la aprobación legal.' : 'It must not be represented as approved or effective until entity facts, contacts and legal approval are recorded.' }}</BaseAlert><dl class="document-meta"><div><dt>{{ label('Version', 'Versión') }}</dt><dd>{{ document.version }}</dd></div><div><dt>{{ label('Last updated', 'Última actualización') }}</dt><dd>{{ document.lastUpdated }}</dd></div><div><dt>{{ label('Status', 'Estado') }}</dt><dd>{{ document.status }}</dd></div></dl></div><nav class="toc" :aria-label="label('On this page', 'En esta página')"><strong>{{ label('On this page', 'En esta página') }}</strong><a v-for="entry in document.sections" :key="entry.id" :href="`#${entry.id}`">{{ entry.title }}</a></nav></div></section>
    <section class="section"><div class="container legal-body"><section v-for="entry in document.sections" :id="entry.id" :key="entry.id" class="stack legal-section"><h2>{{ entry.title }}</h2><p v-for="paragraph in entry.paragraphs" :key="paragraph">{{ paragraph }}</p></section></div></section>
    <PublicForm v-if="document.formId" :form-id="document.formId" />
    <section class="section related-legal"><div class="container stack"><span class="eyebrow">{{ label('Related documents', 'Documentos relacionados') }}</span><div class="grid"><BaseCard v-for="entry in related" :key="entry.id"><NuxtLink :to="entry.canonicalPath"><h3>{{ entry.title }}</h3><p>{{ entry.summary }}</p></NuxtLink></BaseCard></div></div></section>
  </article>
</template>

<script setup lang="ts">
import { getLegalDocuments } from '../../../legal'
import type { LegalDocumentContent } from '../../../legal'

const props = defineProps<{ document: LegalDocumentContent }>()
const label = (en: string, es: string) => (props.document.locale === 'es' ? es : en)
const basePath = computed(() => props.document.locale === 'es' ? props.document.canonicalPath.replace(/^\/es/, '') || '/' : props.document.canonicalPath)
const related = computed(() => getLegalDocuments(props.document.locale).filter((entry) => props.document.relatedDocuments.includes(entry.id)))
useSeoMeta(() => ({
  title: props.document.title,
  description: props.document.summary,
  robots: props.document.status === 'approved' && props.document.indexable ? 'index,follow' : 'noindex,nofollow',
}))
</script>

<style scoped>
.legal-hero { background: linear-gradient(180deg, rgb(108 92 231 / 8%), transparent); }
.legal-layout { display: grid; grid-template-columns: minmax(0, 1fr) 18rem; gap: clamp(2rem, 6vw, 6rem); align-items: start; }
.document-meta { display: flex; flex-wrap: wrap; gap: 1rem; }
.document-meta div { padding: .7rem 1rem; border-radius: var(--radius-md); background: var(--surface-secondary); }
dt { color: var(--text-secondary); font-size: .76rem; text-transform: uppercase; } dd { margin: .15rem 0 0; font-weight: 800; }
.toc { position: sticky; top: 7rem; display: grid; gap: .65rem; padding: 1.25rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--surface-primary); }
.legal-body { max-width: 54rem; }
.legal-section { padding-block: 1.5rem; border-bottom: 1px solid var(--border-subtle); scroll-margin-top: 7rem; }
.legal-section p { color: var(--text-secondary); }
.related-legal a { color: inherit; text-decoration: none; }
@media (max-width: 52rem) { .legal-layout { grid-template-columns: 1fr; } .toc { position: static; } }
</style>
