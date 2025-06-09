import { $ } from '@wdio/globals'

import { Page } from 'page-objects/page'

class StatusPage extends Page {
  overallProgress() {
    return $('[data-testid="app-overall-progress"]')
  }
}

export default new StatusPage()
