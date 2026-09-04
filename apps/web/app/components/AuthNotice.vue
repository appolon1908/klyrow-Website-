<script setup lang="ts">
import { klyrowDomains } from '~/config/domains'

const route = useRoute()
const accessRequired = computed(() => route.query.login_required === '1')
const callbackFailed = computed(() => route.query.auth_error === '1')
const appHandoff = computed(() => route.query.app_handoff === '1')
const visible = computed(
  () => accessRequired.value || callbackFailed.value || appHandoff.value
)
const message = computed(() => {
  if (accessRequired.value) {
    return 'That operation belongs to the secure Klyrow application.'
  }
  if (callbackFailed.value) {
    return 'The secure application could not complete that identity request.'
  }
  return 'Klyrow account and workspace operations run only in the secure application.'
})
</script>

<template>
  <section v-if="visible" class="hz-auth-notice" role="status" aria-live="polite">
    <div class="hz-container hz-auth-notice__inner">
      <p>{{ message }}</p>
      <a class="hz-button hz-button--primary hz-button--small" :href="klyrowDomains.application">
        Open secure application
      </a>
    </div>
  </section>
</template>
