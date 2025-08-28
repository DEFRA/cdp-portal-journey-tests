import { Page } from 'page-objects/page'

class TestSuitesPage extends Page {
  /**
   * Check if the test-suites nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('test-suites')
  }

  open(value = '') {
    return super.open('/test-suites' + value)
  }

  rowForTestSuite(testSuiteName) {
    return $(`tr[class="app-entity-table__row"]*=` + testSuiteName)
  }
}

export default new TestSuitesPage()
