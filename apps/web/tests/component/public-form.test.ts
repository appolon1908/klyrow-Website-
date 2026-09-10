import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import PublicForm from '../../app/components/forms/PublicForm.vue'

describe('PublicForm', () => {
  it('renders a registered bilingual form and reports missing fields accessibly', async () => {
    const wrapper = await mountSuspended(PublicForm, { props: { formId: 'request-demo' } })
    expect(wrapper.get('form').attributes('novalidate')).toBeDefined()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[role="alert"]').text()).toContain('Review the highlighted fields')
  })
})
