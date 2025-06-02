import { browser, expect } from '@wdio/globals'

import CreatePage from 'page-objects/create.page'
import ServicesPage from 'page-objects/services.page'
import FormComponent from 'components/form.component'
import HeadingComponent from 'components/heading.component'
import PageHeadingComponent from 'components/page-heading.component'
import EntityTableComponent from 'components/entity-table.component'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import GovukSummaryListComponent from 'components/govuk-summary-list.component.js'

describe('Create microservice', () => {
  describe('When logged out', () => {
    before(async () => {
      await CreatePage.open()
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
    const testRepositoryName = `test-repo-${new Date().getTime()}`
    const serviceTypes = [
      'DotNet Backend',
      'Node.js Frontend',
      'Node.js Backend'
    ]
    const randomServiceType = Math.floor(Math.random() * serviceTypes.length)
    const serviceType = serviceTypes[randomServiceType]

    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await CreatePage.open()
    })

    it('Should be on the "Create" page', async () => {
      await expect(browser).toHaveTitle(
        'Create | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title('Create')).toExist()
    })

    it('Should be able to choose a Microservice', async () => {
      await expect(
        HeadingComponent.caption('What would you like to create?')
      ).toExist()

      await FormComponent.inputLabel('Microservice').click()
      await FormComponent.submitButton('Next').click()
    })

    it('Should be able to enter microservice details', async () => {
      await expect(browser).toHaveTitle(
        'Create a new microservice | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)
      await expect(
        HeadingComponent.title('Create a new microservice')
      ).toExist()
      await expect(
        HeadingComponent.caption(
          'With associated dashboards, proxy and infrastructure.'
        )
      ).toExist()

      await FormComponent.inputLabel('Name').click()
      await browser.keys(testRepositoryName)

      await FormComponent.inputLabel('Template').click()
      await browser.keys(serviceType)

      await FormComponent.inputLabel('Owning Team').click()
      await browser.keys('Platform')

      await FormComponent.submitButton('Next').click()
    })

    it('Should be able to view microservice summary', async () => {
      await expect(browser).toHaveTitle(
        'Create microservice summary | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)
      await expect(
        HeadingComponent.title('Create microservice summary')
      ).toExist()
      await expect(
        HeadingComponent.caption(
          'Information about the new microservice you are going to create.'
        )
      ).toExist()

      await expect(await GovukSummaryListComponent.row('row-Kind')).toHaveText(
        'Microservice'
      )
      await expect(await GovukSummaryListComponent.row('row-Name')).toHaveText(
        testRepositoryName
      )
      await expect(
        await GovukSummaryListComponent.row('row-Template')
      ).toHaveText(serviceType)
      await expect(
        await GovukSummaryListComponent.row('row-Templatetag')
      ).toHaveText('')
      await expect(
        await GovukSummaryListComponent.row('row-OwningTeam')
      ).toHaveText('Platform')

      await FormComponent.submitButton('Create').click()
    })

    it('Should be redirected to create microservice status page', async () => {
      await expect(browser).toHaveTitle(
        `Creating ${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title(testRepositoryName)).toExist()
      await expect(
        HeadingComponent.caption(
          `Creating the ${testRepositoryName} microservice.`
        )
      ).toExist()
      await expect(ServicesPage.overallProgress()).toHaveText('In-progress')
    })

    it('Should be updated to "success" create microservice page', async () => {
      await expect(browser).toHaveTitle(
        `Created ${testRepositoryName} microservice | Core Delivery Platform - Portal`,
        { wait: 45000 }
      )

      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title(testRepositoryName)).toExist()

      await expect(
        HeadingComponent.caption(
          `Created the ${testRepositoryName} microservice.`
        )
      ).toExist()

      for (const statusTag of [
        'github-repository',
        'config',
        'networking',
        'proxy',
        'dashboards',
        'infrastructure'
      ]) {
        await expect(
          $(`[data-testid="${statusTag}-status-tag"]*=Success`)
        ).toExist()
      }
    })

    it('Should navigate to created microservice page', async () => {
      await ServicesPage.link('new microservices page').click()
      await expect(browser).toHaveTitle(
        `${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Service')).toExist()
      await expect(
        await PageHeadingComponent.title(testRepositoryName)
      ).toExist()
    })

    it('Should display new microservice on services list page', async () => {
      await ServicesPage.open()

      await expect(browser).toHaveTitle(
        'Services | Core Delivery Platform - Portal'
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title('Services')).toExist()

      await expect(
        EntityTableComponent.entityLink(testRepositoryName)
      ).toExist()

      // Wait for Portal backend GitHub poll to run and apply Team to new service
      await browser.waitUntil(
        async function () {
          const element = await EntityTableComponent.row(testRepositoryName)
          const text = await element.getText()
          const hasContent = text.includes('Today at')

          if (hasContent) {
            return true
          }

          await browser.refresh()
          // eslint-disable-next-line wdio/no-pause
          await browser.pause(2000) // Wait for page refresh to happen
          return false
        },
        {
          timeout: 60000,
          timeoutMsg:
            'Timeout waiting for new microservice to appear on services list page in Created status'
        }
      )
    })

    it('Clicking on new microservice on services list page should open service page', async () => {
      await EntityTableComponent.entityLink(testRepositoryName).click()

      await expect(browser).toHaveTitle(
        `${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )
    })
  })
})
