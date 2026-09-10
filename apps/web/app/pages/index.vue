<template><MarketingPage v-if="page" :page="page" /></template>
<script setup lang="ts">
import { getMarketingPage } from '../../content'
const page = getMarketingPage('en', '/')
</script>
