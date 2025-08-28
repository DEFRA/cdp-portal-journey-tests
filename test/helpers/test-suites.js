import { browser } from '@wdio/globals'
import TestSuitePage from 'page-objects/test-suite.page.js'

export const waitForTestStatus = (regex, timeout = 20000) =>
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
