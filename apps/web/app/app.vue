<template>
  <NuxtErrorBoundary>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <template #error="{ error, clearError }">
      <ScaffoldError :error="error" @retry="clearError" />
    </template>
  </NuxtErrorBoundary>
</template>
