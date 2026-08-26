<template>
  <div class="toast-region" role="status" aria-live="polite" aria-atomic="true">
    <slot />
  </div>
</template>

<style scoped>
.toast-region { position: fixed; z-index: 90; right: 1rem; bottom: 1rem; display: grid; gap: .75rem; max-width: min(24rem, calc(100vw - 2rem)); }
</style>
