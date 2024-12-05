import { $ } from '@wdio/globals'

import { Page } from 'page-objects/page'

class TestSuitesPage extends Page {
  /**
   * Check if the test-suites nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('test-suites')
  }

  overallProgress() {
    return $('[data-testid="app-overall-progress"]')
  }

  open(value = '') {
    return super.open('/test-suites' + value)
  }
}

export default new TestSuitesPage()
