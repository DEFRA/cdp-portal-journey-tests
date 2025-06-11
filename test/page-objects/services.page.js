import { $, expect } from '@wdio/globals'

import { Page } from 'page-objects/page'
import TabsComponent from 'components/tabs.component.js'

class ServicesPage extends Page {
  /**
   * Check if the services nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('services')
  }

  serviceSearchBox() {
    return $('[data-testid="app-autocomplete-input"]')
  }

  summary() {
    return $('[data-testid="service-summary"]')
  }

  open(serviceName) {
    const pathValue = serviceName ? `/services/${serviceName}` : '/services'
    return super.open(pathValue)
  }

  async hasOwnerTabs() {
    await expect(TabsComponent.tab('About')).toExist()
    await expect(TabsComponent.tab('Automations')).toExist()
    await expect(TabsComponent.tab('Buckets')).toExist()
    await expect(TabsComponent.tab('Maintenance')).toExist()
    await expect(TabsComponent.tab('Proxy')).toExist()
    await expect(TabsComponent.tab('Secrets')).toExist()
    await expect(TabsComponent.tab('Terminal')).toExist()
  }

  async hasNoTabs() {
    await expect(TabsComponent.tab('About')).not.toExist()
    await expect(TabsComponent.tab('Automations')).not.toExist()
    await expect(TabsComponent.tab('Buckets')).not.toExist()
    await expect(TabsComponent.tab('Maintenance')).not.toExist()
    await expect(TabsComponent.tab('Proxy')).not.toExist()
    await expect(TabsComponent.tab('Secrets')).not.toExist()
    await expect(TabsComponent.tab('Terminal')).not.toExist()
  }
}

export default new ServicesPage()
