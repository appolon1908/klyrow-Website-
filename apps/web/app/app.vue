<template>
  <NuxtErrorBoundary
    ><NuxtPage /><template #error="{ error, clearError }"
      ><ScaffoldError :error="error" @retry="clearError" /></template
  ></NuxtErrorBoundary>
</template>
