import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import BaseButton from '../../app/components/base/BaseButton.vue'
import BaseDialog from '../../app/components/base/BaseDialog.vue'
import SiteHeader from '../../app/components/navigation/SiteHeader.vue'

describe('site shell', () => {
  it('opens and closes the mobile navigation', async () => {
    const wrapper = await mountSuspended(SiteHeader)
    const button = wrapper.get('button[aria-controls="mobile-navigation"]')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(wrapper.find('#mobile-navigation').exists()).toBe(true)
    await wrapper.get('#mobile-navigation button').trigger('click')
    expect(wrapper.find('#mobile-navigation').exists()).toBe(false)
  })

  it('renders an accessible dialog and emits close', async () => {
    const wrapper = await mountSuspended(BaseDialog, { props: { open: true, title: 'Preferences' }, slots: { default: '<button>Save</button>' } })
    expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe('true')
    await wrapper.get('.dialog__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('maps corporate CTA variants to the shared button classes', async () => {
    const wrapper = await mountSuspended(BaseButton, { props: { variant: 'quiet' }, slots: { default: 'Account' } })
    expect(wrapper.classes()).toContain('button--quiet')
  })
})
