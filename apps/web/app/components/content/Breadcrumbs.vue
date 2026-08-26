<template>
  <nav v-if="crumbs.length" class="breadcrumbs" aria-label="Breadcrumb">
    <ol><li><NuxtLink :to="localizePath('/')">Klyrow</NuxtLink></li><li v-for="crumb in crumbs" :key="crumb.path"><span aria-hidden="true">/</span><NuxtLink :to="localizePath(crumb.path)" :aria-current="crumb.current ? 'page' : undefined">{{ crumb.label }}</NuxtLink></li></ol>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ path: string; title: string }>()
const { localizePath } = useLocale()
const crumbs = computed(() => {
  const segments = props.path.split('/').filter(Boolean)
  return segments.map((segment, index) => ({
    label: index === segments.length - 1 ? props.title : segment.replaceAll('-', ' '),
    path: `/${segments.slice(0, index + 1).join('/')}`,
    current: index === segments.length - 1,
  }))
})
</script>

<style scoped>
.breadcrumbs { color: var(--text-secondary); font-size: .82rem; }
ol { display: flex; flex-wrap: wrap; gap: .45rem; padding: 0; list-style: none; }
li { display: inline-flex; gap: .45rem; }
a { text-transform: capitalize; text-decoration: none; }
a:hover { color: var(--brand-primary-strong); }
</style>
