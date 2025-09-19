import { browser } from '@wdio/globals'
import TestSuitePage from 'page-objects/test-suite.page.js'
import { oneMinute } from 'helpers/timeout.js'

export const waitForTestStatus = (regex, timeout = oneMinute) =>
  browser.waitUntil(
    async () => {
      const statusText =
        (await TestSuitePage.latestTestRun().getText()) ?? 'no match'
      return statusText.match(regex)
    },
    {
      timeout,
      timeoutMsg: `Did not get status ${regex} after ${timeout}ms`
    }
  )
