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

  removeSecretButton() {
    return $('[data-testid="app-remove-button"]')
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

  secretUpdate(key) {
    return $(`[data-testid="app-secret-update-${key.toLowerCase()}"]`)
  }

  secretRemove(key) {
    return $(`[data-testid="app-secret-remove-${key.toLowerCase()}"]`)
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
