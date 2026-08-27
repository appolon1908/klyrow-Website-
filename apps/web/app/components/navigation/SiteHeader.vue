<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink :to="localizePath('/')" class="brand" aria-label="Klyrow home">
        <span class="brand__mark" aria-hidden="true">K</span><span>Klyrow</span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <details v-for="group in navigationGroups" :key="group.id" class="nav-group">
          <summary>{{ t(group.labelKey) }}</summary>
          <div class="mega-menu">
            <NuxtLink v-for="item in group.items" :key="item.path" :to="localizePath(item.path)" class="mega-link">
              <strong>{{ item.label }}</strong><span v-if="item.description">{{ item.description }}</span>
            </NuxtLink>
          </div>
        </details>
        <NuxtLink v-for="item in primaryLinks" :key="item.path" :to="localizePath(item.path)" class="nav-link">{{ item.label }}</NuxtLink>
      </nav>

      <div class="header-actions">
        <LanguageSwitcher />
        <a v-if="signInUrl" class="nav-link sign-in" :href="signInUrl">{{ t('signIn') }}</a>
        <BaseButton class="desktop-cta" :to="localizePath('/demo')">{{ t('demo') }}</BaseButton>
        <button ref="menuButton" class="menu-button" type="button" :aria-label="mobileOpen ? t('close') : t('menu')" :aria-expanded="mobileOpen" aria-controls="mobile-navigation" @click="mobileOpen = !mobileOpen">
          <span aria-hidden="true">{{ mobileOpen ? '×' : '☰' }}</span>
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="mobile-backdrop" @mousedown.self="closeMobile">
      <nav id="mobile-navigation" ref="mobilePanel" class="mobile-panel" aria-label="Mobile navigation" @keydown="onPanelKeydown">
        <div class="mobile-panel__top"><strong>Klyrow</strong><button type="button" :aria-label="t('close')" @click="closeMobile">×</button></div>
        <section v-for="group in navigationGroups" :key="group.id" class="mobile-group">
          <h2>{{ t(group.labelKey) }}</h2>
          <NuxtLink v-for="item in group.items" :key="item.path" :to="localizePath(item.path)">{{ item.label }}</NuxtLink>
        </section>
        <NuxtLink v-for="item in primaryLinks" :key="item.path" :to="localizePath(item.path)">{{ item.label }}</NuxtLink>
        <BaseButton :to="localizePath('/demo')">{{ t('demo') }}</BaseButton>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import { navigationGroups, primaryLinks } from '../../data/navigation'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const { t, localizePath } = useLocale()
const mobileOpen = ref(false)
const mobilePanel = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const signInUrl = computed(() => String(runtimeConfig.public.signInUrl || ''))

const closeMobile = () => {
  mobileOpen.value = false
}
const focusable = () =>
  mobilePanel.value?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])') ?? []
const onPanelKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') return closeMobile()
  if (event.key !== 'Tab') return
  const items = [...focusable()]
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => route.fullPath,
  () => closeMobile(),
)
watch(mobileOpen, async (open) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    ;[...focusable()][0]?.focus()
  } else menuButton.value?.focus()
})
onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.site-header { position: fixed; z-index: 50; inset: 0 0 auto; height: var(--header-height); border-bottom: 1px solid var(--border-subtle); background: var(--surface-primary); }
.header-inner { display: flex; height: 100%; align-items: center; gap: 1.5rem; }
.brand { display: inline-flex; flex: 0 0 auto; gap: .7rem; align-items: center; color: var(--text-primary); font-size: 1.08rem; font-weight: 800; letter-spacing: -.02em; text-decoration: none; }
.brand__mark { display: grid; width: 2.1rem; height: 2.1rem; place-items: center; border: 1px solid var(--brand-primary); border-radius: var(--radius-xs); color: var(--surface-deep); background: var(--brand-primary); font-size: .9rem; font-weight: 900; }
.desktop-nav { display: flex; flex: 1; align-items: center; justify-content: center; gap: .15rem; }
.nav-link,
.nav-group summary { min-height: 44px; padding: .9rem .65rem; border-radius: var(--radius-xs); color: var(--text-secondary); font-size: .71rem; font-weight: 800; letter-spacing: .08em; text-decoration: none; text-transform: uppercase; cursor: pointer; list-style: none; }
.nav-link:hover,
.nav-group summary:hover { color: var(--text-primary); background: var(--surface-raised); }
.nav-group { position: relative; }
.nav-group summary::-webkit-details-marker { display: none; }
.mega-menu { position: absolute; top: calc(100% + .65rem); left: 50%; display: grid; width: min(42rem, 82vw); padding: .7rem; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--surface-elevated); box-shadow: var(--shadow-lg); transform: translateX(-50%); }
.mega-link { display: grid; gap: .2rem; padding: 1rem; border-radius: var(--radius-sm); text-decoration: none; }
.mega-link:hover { background: var(--surface-raised); }
.mega-link strong { font-size: .84rem; }
.mega-link span { color: var(--text-muted); font-size: .8rem; }
.header-actions { display: flex; flex: 0 0 auto; align-items: center; gap: .65rem; }
.menu-button { display: none; width: 44px; height: 44px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-primary); background: var(--surface-control); font-size: 1.25rem; cursor: pointer; }
.menu-button:hover { border-color: var(--brand-primary); }
.mobile-backdrop { position: fixed; z-index: 70; inset: 0; background: var(--overlay); }
.mobile-panel { position: absolute; inset: 0 0 0 auto; display: grid; align-content: start; width: min(92vw, 28rem); padding: 1rem 1.25rem 2rem; overflow: auto; border-left: 1px solid var(--border-subtle); background: var(--surface-deep); box-shadow: var(--shadow-lg); }
.mobile-panel__top { display: flex; min-height: 3.6rem; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); }
.mobile-panel__top button { width: 44px; height: 44px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-primary); background: var(--surface-raised); font-size: 1.5rem; cursor: pointer; }
.mobile-group { display: grid; gap: .35rem; padding-block: 1rem; border-bottom: 1px solid var(--border-subtle); }
.mobile-group h2 { color: var(--brand-primary); font-size: .72rem; letter-spacing: .09em; text-transform: uppercase; }
.mobile-panel a:not(.button) { min-height: 44px; padding: .65rem 0; color: var(--text-secondary); text-decoration: none; }
@media (max-width: 68rem) {
  .desktop-nav,
  .desktop-cta,
  .sign-in { display: none; }
  .header-inner { justify-content: space-between; }
  .menu-button { display: inline-grid; place-items: center; }
}
@media (max-width: 34rem) { .language-switcher { display: none; } }
</style>
