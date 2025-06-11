import { Page } from 'page-objects/page'

class ServicesMaintenancePage extends Page {
  /**
   * Check if the services nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('services')
  }

  open(serviceName) {
    return super.open(`/services/${serviceName}/maintenance`)
  }

  shutteringHeading() {
    return $('[data-testid="shuttering"]')
  }

  undeployHeading() {
    return $('[data-testid="undeploy"]')
  }

  shutteringPanel() {
    return $('[data-testid="shuttering-panel"]')
  }

  undeployPanel() {
    return $('[data-testid="undeploy-panel"]')
  }

  confirmShutterPanel() {
    return $('[data-testid="confirm-shutter-panel"]')
  }

  confirmUndeployPanel() {
    return $('[data-testid="confirm-undeploy-panel"]')
  }
}

export default new ServicesMaintenancePage()
