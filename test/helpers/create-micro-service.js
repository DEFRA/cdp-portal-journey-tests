import { browser, expect } from '@wdio/globals'

import FormComponent from 'components/form.component'
import ServicesPage from 'page-objects/services.page'
import { waitForCreateMicroServiceStatus } from 'helpers/wait-for-create-microservice-status.js'

/**
 * Helper to create a microservice. Contains no expectations
 * @param {string} name
 * @param {('TenantTeam1'|'Platform')} teamName
 * @returns {Promise<void>}
 */
async function createMicroService(name, teamName) {
  const serviceTypes = ['DotNet Backend', 'Node.js Frontend', 'Node.js Backend']
  const randomServiceType = Math.floor(Math.random() * serviceTypes.length)
  const serviceType = serviceTypes[randomServiceType]

  // Choose microservice
  await FormComponent.inputLabel('Microservice').click()
  await FormComponent.submitButton('Next').click()

  // Choose detail
  await FormComponent.inputLabel('Name').click()
  await browser.keys(name)
  await FormComponent.inputLabel('Template').click()
  await browser.keys(serviceType)
  await FormComponent.inputLabel('Owning Team').click()
  await browser.keys(teamName)
  await FormComponent.submitButton('Next').click()

  // Create
  await FormComponent.submitButton('Create').click()

  // Status page
  for (const resource of [
    'Repository',
    'TenantServices',
    'SquidProxy',
    'NginxUpstreams',
    'AppConfig',
    'GrafanaDashboard'
  ]) {
    await $(`[data-testid="${resource}-created"]`).waitForExist({
      timeout: 20000
    })
  }

  await waitForCreateMicroServiceStatus('Created')
  await expect(ServicesPage.overallProgress()).toHaveText('Created')
  await expect(browser).toHaveTitle(
    `Created ${name} microservice | Core Delivery Platform - Portal`
  )

  // Click link to new microservice page
  await ServicesPage.link("go to your new service's home page").click()

  // Wait for Portal backend GitHub poll to run and apply Team to new service
  await browser.waitUntil(
    async function () {
      const summaryMarkup = await ServicesPage.summary().getHTML()
      const hasTeam = summaryMarkup.includes(teamName)

      if (hasTeam) {
        return true
      }

      await browser.refresh()
      // eslint-disable-next-line wdio/no-pause
      await browser.pause(200) // Wait for page refresh to happen
      return false
    },
    {
      timeout: 20000,
      timeoutMsg:
        'GitHub poll took too long, Team on new microservice not updated'
    }
  )
}

export { createMicroService }
