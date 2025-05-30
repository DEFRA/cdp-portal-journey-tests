import { Page } from 'page-objects/page'

class ServicesServicesSecretsPage extends Page {
  /**
   * Check if the services nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('services')
  }

  open(serviceName, environment) {
    if (environment) {
      return super.open(`services/${serviceName}/secrets/${environment}`)
    } else {
      return super.open(`services/${serviceName}/secrets`)
    }
  }

  secretsSelectedTab(value = 'Secrets') {
    return $('[data-testid="app-tabs-list-item--selected"]*=' + value)
  }

  environmentHeader() {
    return $('[data-testid="app-environment-header"]')
  }

  updateHeader() {
    return $('[data-testid="app-update-header"]')
  }

  createSecretButton() {
    return $('[data-testid="app-button"]')
  }

  updateSecretButton() {
    return this.createSecretButton()
  }

  createSecretName() {
    return $('#secret-key')
  }

  createSecretValue() {
    return $('#secret-value')
  }

  updateSecretValue() {
    return this.createSecretValue()
  }

  secretCell(key) {
    return $(`[data-testid="app-secret-cell-${key.toLowerCase()}"]`)
  }

  secretAction(key) {
    return $(`[data-testid="app-secret-action-${key.toLowerCase()}"]`)
  }

  secretActionCell(key) {
    return $(`[data-testid="app-secret-action-cell-${key.toLowerCase()}"]`)
  }

  secretStatus(key, status) {
    return $(
      `[data-testid="app-secret-status-${key.toLowerCase()}"] [data-text="${status}"]`
    )
  }
}

export default new ServicesServicesSecretsPage()
