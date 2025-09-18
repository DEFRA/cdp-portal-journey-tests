import { $ } from '@wdio/globals'

/**
 * govukTable helper component
 */
class GovukTableComponent {
  content() {
    return $('[data-testid="govuk-table"]')
  }

  linkInRow({ testId, rowContent, linkText, dataTestId = 'app-link' }) {
    return $(`[data-testid="${testId}"]`)
      .$(`tr.*=${rowContent}`)
      .$(`a[data-testid="${dataTestId}"].*=${linkText}`)
  }
}

export default new GovukTableComponent()
