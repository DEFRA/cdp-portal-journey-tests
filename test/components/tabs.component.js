import { $ } from '@wdio/globals'

/** appTabs component */
class TabsComponent {
  activeTab() {
    return $('[data-testid*="app-tabs-list-item--selected"]')
  }

  secondTab() {
    return $('[data-testid="app-tabs-list-item-2"]')
  }

  thirdTab() {
    return $('[data-testid="app-tabs-list-item-3"]')
  }

  fourthTab() {
    return $('[data-testid="app-tabs-list-item-4"]')
  }
}

export default new TabsComponent()
