import { $, browser, expect } from '@wdio/globals'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

import DeployPage from 'page-objects/deploy.page'
import DeploymentsPage from 'page-objects/deployments.page'
import FormComponent from 'components/form.component'
import HeadingComponent from 'components/heading.component'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'

const waitUntilMemoryDataLoads = () =>
  browser.waitUntil(
    async () => {
      const firsOptionText = await $('[data-testid="deploy-memory"]')
        .$('option')
        .getText()

      return firsOptionText.includes('select')
    },
    {
      timeout: 5000,
      timeoutMsg: 'Memory dropdown did not load memory options data'
    }
  )

describe('Deploy service', () => {
  describe('When logged out', () => {
    before(async () => {
      await DeployPage.open()
    })

    it('Should show the "401" error page', async () => {
      await expect(browser).toHaveTitle(
        'Unauthorized | Core Delivery Platform - Portal'
      )
      await expect(ErrorPage.title('401')).toExist()
      await expect(ErrorPage.message()).toHaveText('Unauthorized')
    })
  })

  describe('When logged in as admin user', () => {
    const imageName = 'cdp-portal-frontend'
    const version = '0.172.0'
    const environment = 'management'
    const instanceCount = '2'
    const cpuFormValue = '1024'
    const memoryFormValue = '2048'
    const cpuText = '1 vCPU'
    const memoryText = '2 GB'

    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await DeployPage.open()
    })

    it('Should be on the "Deploy details" page', async () => {
      await expect(browser).toHaveTitle(
        'Deploy Service details | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title('Details')).toExist()
      await expect(
        HeadingComponent.caption(
          'Provide the microservice image name, version and environment to deploy to.'
        )
      ).toExist()

      await FormComponent.inputLabel('Image Name').click()
      await browser.keys(imageName)
      await browser.keys('Enter')

      await FormComponent.inputLabel('Image Version').click()

      // Wait for version to appear in info panel
      await expect(
        await $('[data-testid="latest-published-version"]*=' + version)
      ).toBeDisplayed()

      await browser.keys(version)
      await browser.keys('Down arrow')
      await browser.keys('Enter')

      await FormComponent.inputLabel('Environment').click()
      await browser.keys(environment)

      await FormComponent.submitButton('Next').click()
    })

    it('Should be on the "Deploy options" page', async () => {
      await expect(browser).toHaveTitle(
        'Deploy Service options | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title('Options')).toExist()
      await expect(
        HeadingComponent.caption(
          'Choose Microservice Instance count, CPU and Memory allocation.'
        )
      ).toExist()

      await FormComponent.inputLabel('Instance count').click()
      await browser.keys(instanceCount)

      await FormComponent.inputLabel('CPU size').click()
      await browser.keys(cpuFormValue)

      await waitUntilMemoryDataLoads()

      await FormComponent.inputLabel('Memory allocation').click()
      await browser.keys(memoryFormValue)

      await FormComponent.submitButton('Next').click()
    })

    const formattedEnvironment = upperFirst(kebabCase(environment))

    it('Should be able to view deployment summary', async () => {
      await expect(browser).toHaveTitle(
        'Deploy Service summary | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title('Deployment summary')).toExist()
      await expect(
        HeadingComponent.caption(
          'Information about the Microservice you are going to deploy.'
        )
      ).toExist()

      // Check deploy summary contents
      const summary = $('[data-testid="deploy-summary"]')
      await expect(summary).toHaveHTML(expect.stringContaining(imageName))
      await expect(summary).toHaveHTML(expect.stringContaining(version))
      await expect(summary).toHaveHTML(
        expect.stringContaining(formattedEnvironment)
      )
      await expect(summary).toHaveHTML(expect.stringContaining(instanceCount))
      await expect(summary).toHaveHTML(expect.stringContaining(cpuText))
      await expect(summary).toHaveHTML(expect.stringContaining(memoryText))

      await FormComponent.submitButton('Deploy').click()
    })

    it('Should be redirected to the deployment page', async () => {
      await expect(browser).toHaveTitle(
        `${imageName} ${version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )
      await expect(await DeploymentsPage.navIsActive()).toBe(true)
      await expect(
        HeadingComponent.title(`${formattedEnvironment} deployment`)
      ).toExist()

      const headingCaption = HeadingComponent.caption(
        'Microservice deployment for'
      )

      await expect(headingCaption).toExist()
      await expect(headingCaption).toHaveText(
        `Microservice deployment for ${imageName}, version ${version}`
      )

      // Check deployment summary contents
      const deploymentSummary = $('[data-testid="deployment-summary"]')
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(imageName)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(version)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(formattedEnvironment)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(instanceCount)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(cpuText)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(memoryText)
      )
    })
  })
})
