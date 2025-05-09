import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class ApplyChangelog extends Page {
  /**
   * Check if the apply changelog nav link is active
   * @returns {Promise<boolean>}
   */
  navIsActive() {
    return super.navIsActive('apply-changelog')
  }

  open() {
    return super.open('/apply-changelog')
  }

  summary() {
    return $('[data-testid="apply-changelog-summary"]')
  }
}

export default new ApplyChangelog()
