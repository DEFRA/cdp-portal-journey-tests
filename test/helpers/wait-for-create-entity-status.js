import { browser } from '@wdio/globals'
import StatusPage from 'page-objects/status.page.js'
import { oneMinute } from 'helpers/timeout.js'

export const waitForCreateEntityStatus = (value, timeout = oneMinute) =>
  browser.waitUntil(
    async () => {
      const statusText =
        (await StatusPage.overallProgress().getText()) ?? 'no match'
      return statusText.includes(value)
    },
    {
      timeout,
      timeoutMsg: `Did not get status ${value} after ${timeout}ms`
    }
  )
