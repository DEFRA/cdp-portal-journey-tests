import { $ } from '@wdio/globals'

/**
 * govukTable helper component
 */
class GovukTableComponent {
  content() {
    return $('[data-testid="govuk-table"]')
  }

  linkInRow({ testId, rowContent, linkText }) {
    return $(`[data-testid="${testId}"]`)
      .$(`tr.*=${rowContent}`)
      .$(`a[data-testid="app-link"].*=${linkText}`)
  }
}

export default new GovukTableComponent()
