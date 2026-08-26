<template>
  <section v-if="items.length" class="related section">
    <div class="container stack"><span class="eyebrow">{{ locale === 'es' ? 'Continúa explorando' : 'Keep exploring' }}</span><h2>{{ locale === 'es' ? 'Páginas relacionadas' : 'Related pages' }}</h2><div class="grid"><BaseCard v-for="item in items" :key="item.path" interactive><h3>{{ item.title }}</h3><p class="muted">{{ item.summary }}</p><BaseButton :to="localizedContentPath(locale, item.path)" variant="text">{{ locale === 'es' ? 'Ver página' : 'View page' }} →</BaseButton></BaseCard></div></div>
  </section>
</template>

<script setup lang="ts">
import { getMarketingPage, localizedContentPath } from '../../../content'

const props = defineProps<{ paths: string[] }>()
const { locale } = useLocale()
const items = computed(() => props.paths.map((path) => getMarketingPage(locale.value, path)).filter((page) => page !== undefined))
</script>
