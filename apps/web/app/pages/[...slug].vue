<template><MarketingPage :page="page" /></template>
<script setup lang="ts">
import { getMarketingPage } from '../../content'
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : String(route.params.slug ?? '')
const path = `/${slug}`
const page = getMarketingPage('en', path)
if (!page) throw createError({ statusCode: 404, statusMessage: 'Page not found' })
</script>
