<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink :to="localizePath('/')" class="brand" aria-label="Klyrow home">
        <span class="brand__mark" aria-hidden="true">K</span><span>Klyrow</span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <details v-for="group in navigationGroups" :key="group.id" class="nav-group">
          <summary>{{ t(group.labelKey) }}</summary>
          <div class="mega-menu glass">
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
.site-header { position: sticky; z-index: 50; top: 0; border-bottom: 1px solid rgb(223 226 244 / 70%); background: rgb(251 251 255 / 84%); backdrop-filter: blur(18px); }
.header-inner { display: flex; min-height: 4.7rem; align-items: center; gap: 1.5rem; }
.brand { display: inline-flex; gap: .65rem; align-items: center; font-size: 1.15rem; font-weight: 850; letter-spacing: -.03em; text-decoration: none; }
.brand__mark { display: grid; width: 2.2rem; height: 2.2rem; place-items: center; border-radius: .75rem; color: #fff; background: linear-gradient(145deg, var(--brand-primary), var(--accent-cyan)); box-shadow: 0 8px 20px rgb(91 77 247 / 28%); }
.desktop-nav { display: flex; flex: 1; align-items: center; gap: .3rem; }
.nav-link,
.nav-group summary { padding: .7rem .7rem; border-radius: var(--radius-sm); color: var(--text-secondary); font-size: .92rem; font-weight: 720; text-decoration: none; cursor: pointer; list-style: none; }
.nav-link:hover,
.nav-group summary:hover { color: var(--text-primary); background: var(--surface-secondary); }
.nav-group { position: relative; }
.nav-group summary::-webkit-details-marker { display: none; }
.mega-menu { position: absolute; top: calc(100% + .7rem); left: 0; display: grid; width: min(38rem, 80vw); padding: .8rem; grid-template-columns: repeat(2, minmax(0, 1fr)); border-radius: var(--radius-lg); }
.mega-link { display: grid; gap: .2rem; padding: 1rem; border-radius: var(--radius-md); text-decoration: none; }
.mega-link:hover { background: var(--surface-secondary); }
.mega-link span { color: var(--text-secondary); font-size: .84rem; }
.header-actions { display: flex; align-items: center; gap: .85rem; }
.menu-button { display: none; width: 2.8rem; height: 2.8rem; border: 1px solid var(--border-subtle); border-radius: 50%; background: var(--surface-elevated); font-size: 1.4rem; cursor: pointer; }
.mobile-backdrop { position: fixed; z-index: 70; inset: 0; background: rgb(10 12 32 / 58%); }
.mobile-panel { position: absolute; inset: 0 0 0 auto; display: grid; align-content: start; width: min(92vw, 26rem); padding: 1rem 1.25rem 2rem; overflow: auto; background: var(--surface-elevated); box-shadow: var(--shadow-lg); }
.mobile-panel__top { display: flex; min-height: 3.4rem; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); }
.mobile-panel__top button { border: 0; background: transparent; font-size: 2rem; cursor: pointer; }
.mobile-group { display: grid; gap: .4rem; padding-block: 1rem; border-bottom: 1px solid var(--border-subtle); }
.mobile-group h2 { font-size: 1rem; }
.mobile-panel a:not(.button) { padding: .65rem 0; text-decoration: none; }
@media (max-width: 68rem) {
  .desktop-nav,
  .desktop-cta,
  .sign-in { display: none; }
  .header-inner { justify-content: space-between; }
  .menu-button { display: inline-grid; place-items: center; }
}
@media (max-width: 34rem) { .language-switcher { display: none; } }
</style>
