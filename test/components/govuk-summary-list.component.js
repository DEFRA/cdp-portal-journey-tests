import { $ } from '@wdio/globals'

/**
 * govUkSummaryList helper component
 */
class GovUkSummaryListComponent {
  content() {
    return $('[data-testid="govuk-summary-list"]')
  }

  row(testId) {
    return $(`[data-testid="govuk-summary-list"] [data-testid="${testId}"]`)
  }
}

export default new GovUkSummaryListComponent()
