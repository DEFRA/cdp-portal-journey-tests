import { $ } from '@wdio/globals'

import { Page } from 'page-objects/page'

class ServicesPage extends Page {
  /**
   * Check if the services nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('services')
  }

  overallProgress() {
    return $('[data-testid="app-overall-progress"]')
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
}

export default new ServicesPage()
