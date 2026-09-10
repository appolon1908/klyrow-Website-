interface ConfigResponse { data: { csrf_token: string } }
interface ToolResponse<T> { data: T; request_id: string }

export const useToolRequest = () => {
  const pending = ref(false)
  const errorMessage = ref('')
  const execute = async <T>(endpoint: string, body: Record<string, unknown>): Promise<T | undefined> => {
    pending.value = true; errorMessage.value = ''
    try {
      const config = await $fetch<ConfigResponse>('/api/v1/public/config')
      const idempotencyKey = `idem_tool_${globalThis.crypto?.randomUUID?.().replaceAll('-', '') ?? Date.now()}`
      const response = await $fetch<ToolResponse<T>>(endpoint, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey, 'X-CSRF-Token': config.data.csrf_token }, body })
      return response.data
    } catch (error: unknown) {
      const data = error && typeof error === 'object' && 'data' in error ? (error as { data?: { detail?: string } }).data : undefined
      errorMessage.value = data?.detail ?? 'The tool is temporarily unavailable.'
      return undefined
    } finally { pending.value = false }
  }
  return { pending: readonly(pending), errorMessage: readonly(errorMessage), execute }
}
