<script setup lang="ts">
import { klyrowDomains, primaryNavigation } from '~/config/domains'
import {
  localeFromRoutePath,
  localizedContentPath
} from '../../content'

const route = useRoute()
const menuOpen = ref(false)
const locale = computed(() => localeFromRoutePath(route.path))
const isSpanish = computed(() => locale.value === 'es')
const localize = (path: string) => localizedContentPath(locale.value, path)
const spanishLabels: Record<string, string> = {
  Platform: 'Plataforma',
  Developers: 'Desarrolladores',
  Security: 'Seguridad',
  Pricing: 'Precios'
}
const navigationItems = computed(() =>
  primaryNavigation.map((item) => ({
    label: isSpanish.value ? (spanishLabels[item.label] ?? item.label) : item.label,
    to: localize(item.to)
  }))
)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)

const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <header class="hz-site-header">
    <div class="hz-container hz-site-header__inner">
      <NuxtLink
        class="hz-brand"
        :to="localize('/')"
        :aria-label="isSpanish ? 'Inicio de Klyrow' : 'Klyrow home'"
      >
        <span class="hz-brand__mark" aria-hidden="true">K</span>
        <span>Klyrow</span>
        <span class="hz-brand__domain">klyrow.com</span>
      </NuxtLink>

      <nav
        class="hz-site-nav hz-site-nav--desktop"
        :aria-label="isSpanish ? 'Navegación principal' : 'Primary navigation'"
      >
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          class="hz-site-nav__link"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hz-header-actions">
        <a class="hz-button hz-button--secondary hz-button--small" :href="klyrowDomains.application">
          {{ isSpanish ? 'Abrir aplicación' : 'Open app' }}
        </a>
        <a class="hz-button hz-button--primary hz-button--small" :href="klyrowDomains.signup">
          {{ isSpanish ? 'Crear cuenta' : 'Create account' }}
        </a>
        <button
          class="hz-button hz-button--secondary hz-menu-button"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="klyrow-mobile-navigation"
          :aria-label="
            menuOpen
              ? (isSpanish ? 'Cerrar navegación' : 'Close navigation')
              : (isSpanish ? 'Abrir navegación' : 'Open navigation')
          "
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? '×' : '☰' }}
        </button>
      </div>
    </div>

    <div v-if="menuOpen" id="klyrow-mobile-navigation" class="hz-mobile-panel" data-open="true">
      <nav
        class="hz-container hz-mobile-panel__inner"
        :aria-label="isSpanish ? 'Navegación móvil' : 'Mobile navigation'"
      >
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          class="hz-site-nav__link"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink class="hz-site-nav__link" :to="localize('/contact')">
          {{ isSpanish ? 'Contactar ventas' : 'Contact sales' }}
        </NuxtLink>
        <a class="hz-site-nav__link" :href="klyrowDomains.application">
          {{ isSpanish ? 'Abrir aplicación' : 'Open app' }}
        </a>
        <a class="hz-site-nav__link" :href="klyrowDomains.signup">
          {{ isSpanish ? 'Crear cuenta' : 'Create account' }}
        </a>
      </nav>
    </div>
  </header>
</template>
