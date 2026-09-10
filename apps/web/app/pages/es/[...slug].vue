<template>
  <MarketingPage v-if="marketingPage" :page="marketingPage" />
  <LegalDocumentPage v-else-if="legalDocument" :document="legalDocument" />
  <LegalUtilityPage v-else-if="legalUtility" :utility="legalUtility" locale="es" />
</template>
<script setup lang="ts">
import { getMarketingPage } from '../../../content'
import { getLegalDocument, resolveLegalUtility } from '../../../legal'
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : String(route.params.slug ?? '')
const path = `/${slug}`
const marketingPage = getMarketingPage('es', path)
const legalDocument = getLegalDocument('es', path)
const legalUtility = resolveLegalUtility(path)
if (!marketingPage && !legalDocument && !legalUtility) throw createError({ statusCode: 404, statusMessage: 'Página no encontrada' })
</script>
