import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ScaffoldError from '../../app/components/feedback/ScaffoldError.vue'
describe('scaffold error boundary content', () => {
  it('renders an accessible alert', async () => {
    const wrapper = await mountSuspended(ScaffoldError, { props: { error: new Error('test') } })
    expect(wrapper.get('[role="alert"]').text()).toContain('Unable to render scaffold')
  })
})
