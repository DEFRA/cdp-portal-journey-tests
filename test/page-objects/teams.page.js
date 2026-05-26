import { $ } from '@wdio/globals'

import { Page } from 'page-objects/page'

class TeamsPage extends Page {
  get title() {
    return $('[data-testid="app-page-heading-title"]')
  }

  get serviceName() {
    return $('[data-testid="app-service-header-service-name"]')
  }

  navIsActive() {
    return super.navIsActive('teams')
  }

  open() {
    return super.open('/teams')
  }
}

export default new TeamsPage()
