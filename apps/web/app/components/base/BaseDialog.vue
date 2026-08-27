<template>
  <Teleport to="body">
    <div v-if="open" class="backdrop" @mousedown.self="close">
      <section ref="panel" class="dialog card" role="dialog" aria-modal="true" :aria-labelledby="titleId" @keydown="onKeydown">
        <header class="dialog__header">
          <h2 :id="titleId">{{ title }}</h2>
          <button class="dialog__close" type="button" aria-label="Close" @click="close">×</button>
        </header>
        <slot />
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
const panel = ref<HTMLElement | null>(null)
const titleId = useId()
let previousFocus: HTMLElement | null = null

const focusable = () =>
  panel.value?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') ?? []

const close = () => emit('close')
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') return close()
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
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) return
    if (isOpen) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      ;[...focusable()][0]?.focus()
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      previousFocus?.focus()
    }
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.backdrop { position: fixed; z-index: 80; inset: 0; display: grid; place-items: center; padding: 1rem; background: var(--overlay); }
.dialog { width: min(100%, 38rem); max-height: min(90vh, 50rem); overflow: auto; box-shadow: var(--shadow-lg); }
.dialog__header { display: flex; gap: 1rem; align-items: center; justify-content: space-between; }
.dialog__header h2 { font-size: 1.7rem; }
.dialog__close { width: 44px; height: 44px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-primary); background: var(--surface-raised); font-size: 1.5rem; cursor: pointer; }
.dialog__close:hover { border-color: var(--brand-primary); }
</style>
