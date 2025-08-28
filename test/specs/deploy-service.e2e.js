import { $, browser, expect } from '@wdio/globals'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

import DeployPage from 'page-objects/deploy.page'
import DeploymentsPage from 'page-objects/deployments.page'
import PageHeadingComponent from 'components/page-heading.component'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import {
  confirmDeployment,
  populateDeploymentDetails,
  populateDeploymentOptions,
  waitForDeploymentToFinish
} from 'helpers/deploy-service.js'

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
    const options = {
      imageName: 'cdp-portal-backend',
      version: '0.3.0',
      environment: 'management',
      instanceCount: '2',
      cpuFormValue: '1024',
      memoryFormValue: '2048',
      cpuText: '1 vCPU',
      memoryText: '2 GB'
    }

    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await DeployPage.open()
    })

    it('Should be on the "Deploy details" page', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service details | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)
      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Details')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Provide the microservice image name, version and environment to deploy to'
        )
      ).toExist()

      await populateDeploymentDetails(options, true)
    })

    it('Should be on the "Deploy options" page', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service options | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)

      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Options')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Choose microservice instance count, CPU and memory allocation'
        )
      ).toExist()

      await populateDeploymentOptions(options, true)
    })

    const formattedEnvironment = upperFirst(kebabCase(options.environment))

    it('Should be able to view deployment summary', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service summary | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)

      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Summary')).toExist()

      const $pageHeadingIntro = PageHeadingComponent.intro()
      await expect($pageHeadingIntro).toExist()
      await expect($pageHeadingIntro).toHaveHTML(
        expect.stringContaining(
          'Information about the microservice you are going to deploy'
        )
      )

      // Check deploy summary contents
      const $summary = $('[data-testid="deploy-summary"]')
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.imageName)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.version)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.environment)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.instanceCount)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.cpuText)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.memoryText)
      )

      await confirmDeployment()
    })

    it('Should be redirected to the deployment page', async () => {
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )
      await expect(await DeploymentsPage.navIsActive()).toBe(true)

      await expect(
        PageHeadingComponent.caption('Microservice deployment')
      ).toExist()
      await expect(
        await PageHeadingComponent.title(options.imageName)
      ).toExist()

      const pageHeadingIntro = PageHeadingComponent.intro(
        'Microservice deployment for'
      )
      await expect(pageHeadingIntro).toExist()
      await expect(pageHeadingIntro).toHaveText(
        `Microservice deployment for ${options.imageName}, version ${options.version} in ${options.environment}`
      )

      // Check deployment summary contents
      const deploymentSummary = $('[data-testid="deployment-summary"]')
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.imageName)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.version)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.environment)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.instanceCount)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.cpuText)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.memoryText)
      )
    })

    it('Should see the status change to running', async () => {
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )

      const status = $('[data-testid="deployment-status"]')

      await waitForDeploymentToFinish()
      await expect(status).toHaveText('Running')
    })

    it('Should list the new deployment under', async () => {
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )
      const status = $('[data-testid="deployment-status"]')
      await expect(status).toHaveText('Running')
    })
  })

  describe('When logged in as tenant user', () => {
    const options = {
      imageName: 'tenant-backend',
      version: '0.1.0',
      environment: 'dev',
      instanceCount: '2',
      cpuFormValue: '1024',
      memoryFormValue: '2048',
      cpuText: '1 vCPU',
      memoryText: '2 GB'
    }

    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await DeployPage.open()
    })

    it('Should be on the "Deploy details" page', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service details | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)
      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Details')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Provide the microservice image name, version and environment to deploy to'
        )
      ).toExist()

      await populateDeploymentDetails(options, true)
    })

    it('Should be on the "Deploy options" page', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service options | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)

      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Options')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Choose microservice instance count, CPU and memory allocation'
        )
      ).toExist()

      await populateDeploymentOptions(options, true)
    })

    const formattedEnvironment = upperFirst(kebabCase(options.environment))

    it('Should be able to view deployment summary', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service summary | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)

      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Summary')).toExist()

      const $pageHeadingIntro = PageHeadingComponent.intro()
      await expect($pageHeadingIntro).toExist()
      await expect($pageHeadingIntro).toHaveHTML(
        expect.stringContaining(
          'Information about the microservice you are going to deploy'
        )
      )

      // Check deploy summary contents
      const $summary = $('[data-testid="deploy-summary"]')
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.imageName)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.version)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.environment)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.instanceCount)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.cpuText)
      )
      await expect($summary).toHaveHTML(
        expect.stringContaining(options.memoryText)
      )

      await confirmDeployment()
    })

    it('Should be redirected to the deployment page', async () => {
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )
      await expect(await DeploymentsPage.navIsActive()).toBe(true)

      await expect(
        PageHeadingComponent.caption('Microservice deployment')
      ).toExist()
      await expect(
        await PageHeadingComponent.title(options.imageName)
      ).toExist()

      const pageHeadingIntro = PageHeadingComponent.intro(
        'Microservice deployment for'
      )
      await expect(pageHeadingIntro).toExist()
      await expect(pageHeadingIntro).toHaveText(
        `Microservice deployment for ${options.imageName}, version ${options.version} in ${options.environment}`
      )

      // Check deployment summary contents
      const deploymentSummary = $('[data-testid="deployment-summary"]')
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.imageName)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.version)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.environment)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.instanceCount)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.cpuText)
      )
      await expect(deploymentSummary).toHaveHTML(
        expect.stringContaining(options.memoryText)
      )
    })

    it('Should see the status change to running', async () => {
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )

      const status = $('[data-testid="deployment-status"]')

      await waitForDeploymentToFinish()
      await expect(status).toHaveText('Running')
    })

    it('Should list the new deployment under', async () => {
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )
      const status = $('[data-testid="deployment-status"]')
      await expect(status).toHaveText('Running')
    })
  })
})
