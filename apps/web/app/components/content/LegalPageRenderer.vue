<template>
  <article class="legal-renderer container section">
    <header class="stack"><span class="badge">{{ status }}</span><h1>{{ title }}</h1><p class="lede">{{ summary }}</p><p class="muted">{{ locale === 'es' ? 'Última actualización' : 'Last updated' }}: {{ lastUpdated }}</p></header>
    <nav v-if="headings.length" class="card legal-toc" :aria-label="locale === 'es' ? 'Contenido' : 'Contents'"><strong>{{ locale === 'es' ? 'Contenido' : 'Contents' }}</strong><a v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`">{{ heading.label }}</a></nav>
    <div class="legal-body prose"><slot /></div>
  </article>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string; summary: string; locale: 'en' | 'es'; lastUpdated: string; status?: 'draft' | 'review' | 'approved'; headings?: { id: string; label: string }[] }>(), { status: 'draft', headings: () => [] })
</script>

<style scoped>
.legal-renderer { display: grid; gap: 2rem; }
.legal-toc { display: grid; gap: .65rem; }
.legal-body { display: grid; gap: 1.4rem; }
@media print { :global(.site-header), :global(.site-footer), .legal-toc { display: none !important; } .legal-renderer { width: 100%; padding: 0; } }
</style>
