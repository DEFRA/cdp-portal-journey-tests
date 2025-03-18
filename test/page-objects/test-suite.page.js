import { $ } from '@wdio/globals'

import { Page } from 'page-objects/page'

class TestSuitePage extends Page {
  /**
   * Check if the test-suites nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('test-suites')
  }

  selectEnvironment() {
    return $('[name="environment"]')
  }

  startButton() {
    return $('[data-testid="app-button"]')
  }

  latestTestRun() {
    return $('tr[data-testid="app-entity-table-row-1"]')
  }

  open(testSuiteName = '') {
    return super.open('/test-suites/' + testSuiteName)
  }
}

export default new TestSuitePage()
