import { browser } from '@wdio/globals'
import ServicesPage from 'page-objects/services.page.js'

export const waitForCreateMicroServiceStatus = (value, timeout = 20000) =>
  browser.waitUntil(
    async () => {
      const statusText =
        (await ServicesPage.overallProgress().getText()) ?? 'no match'
      return statusText.includes(value)
    },
    {
      timeout,
      timeoutMsg: `Did not get status ${value} after ${timeout}ms`
    }
  )
