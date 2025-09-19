import FormComponent from 'components/form.component'
import { browser } from '@wdio/globals'
import DeployPage from 'page-objects/deploy.page.js'
import { oneMinute } from 'helpers/timeout.js'

const populateDeploymentDetails = async (options, submit = true) => {
  if (!(await DeployPage.navIsActive())) {
    await DeployPage.open()
  }

  await FormComponent.inputLabel('Image name').click()
  await browser.keys(options.imageName)
  await browser.keys('Enter')

  await FormComponent.inputLabel('Image version').click()

  // Wait for version to appear in info panel
  await expect(
    await $('[data-testid="latest-published-version"]*=' + options.version)
  ).toBeDisplayed()

  await browser.keys(options.version)
  await browser.keys('Down arrow')
  await browser.keys('Enter')

  await FormComponent.inputLabel('Environment').click()
  await browser.keys(options.environment)
  await browser.keys('Down arrow')

  if (submit) await FormComponent.submitButton('Next').click()
}

const populateDeploymentOptions = async (options, submit = true) => {
  if (await FormComponent.inputLabel('Instance count').isEnabled()) {
    await FormComponent.inputLabel('Instance count').click()
    await browser.keys(options.instanceCount)

    await FormComponent.inputLabel('CPU size').click()
    await browser.keys(options.cpuFormValue)

    await waitUntilMemoryDataLoads()

    await FormComponent.inputLabel('Memory allocation').click()
    await browser.keys(options.memoryFormValue)
  }

  if (submit) await FormComponent.submitButton('Next').click()
}

const confirmDeployment = async () => {
  await FormComponent.submitButton('Deploy').click()
}

const waitForDeploymentToFinish = async (desiredStatus = 'Running') => {
  const status = $('[data-testid="deployment-status"]')
  await browser.waitUntil(
    async () => {
      const actualStatus = await status.getText()
      return actualStatus === desiredStatus
    },
    {
      timeout: oneMinute,
      interval: 500,
      timeoutMsg: `Status did not reach ${desiredStatus}`
    }
  )
}

const waitUntilMemoryDataLoads = async () =>
  await browser.waitUntil(
    async () => {
      const firstOptionText = await $('[data-testid="deploy-memory"]')
        .$('option')
        .getText()

      return firstOptionText.includes('select')
    },
    {
      timeout: 5000,
      timeoutMsg: 'Memory dropdown did not load memory options data'
    }
  )

const deployService = async (options) => {
  await populateDeploymentDetails(options)
  await populateDeploymentOptions(options)
  await confirmDeployment()
  await waitForDeploymentToFinish()
}

export {
  waitUntilMemoryDataLoads,
  waitForDeploymentToFinish,
  populateDeploymentOptions,
  populateDeploymentDetails,
  confirmDeployment,
  deployService
}
