import { Page } from 'page-objects/page'

class ServicesAutomationsPage extends Page {
  /**
   * Check if the services nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('services')
  }

  open(serviceName) {
    return super.open(`/services/${serviceName}/automations`)
  }

  deploymentsHeading() {
    return $('[data-testid="automatic-deployments"]')
  }

  testRunsHeading() {
    return $('[data-testid="automatic-test-runs"]')
  }

  addTestRunFormHeading() {
    return $('[data-testid="add-test-run"]')
  }

  testRunsListNoResults() {
    return $('[data-testid="app-entity-table-no-results"]')
  }

  testRunsListRow(rowNumber) {
    return $(`[data-testid="app-entity-table-row-${rowNumber}"]`)
  }
}

export default new ServicesAutomationsPage()
