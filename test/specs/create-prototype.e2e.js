import { $, browser, expect } from '@wdio/globals'

import CreatePage from 'page-objects/create.page'
import ServicesPage from 'page-objects/services.page'
import FormComponent from 'components/form.component'
import PageHeadingComponent from 'components/page-heading.component'
import LinkComponent from 'components/link.component'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import GovukSummaryListComponent from 'components/govuk-summary-list.component.js'
import { waitForCreateEntityStatus } from 'helpers/wait-for-create-entity-status.js'
import StatusPage from 'page-objects/status.page.js'
import { describeWithAnnotations } from 'helpers/test-filters.js'

describe('Create prototype', () => {
  describeWithAnnotations('When logged out', ['@smoke'], () => {
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

  describeWithAnnotations('When logged in as admin user', [], () => {
    const testRepositoryName = `test-prototype-${new Date().getTime()}`

    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await CreatePage.open()
    })

    it('Should be on the "Create" page', async () => {
      await expect(browser).toHaveTitle(
        'Create | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)

      await expect(PageHeadingComponent.title('Create')).toExist()
      await expect(
        PageHeadingComponent.intro('What would you like to create?')
      ).toExist()
    })

    it('Should be able to choose a prototype', async () => {
      await expect(PageHeadingComponent.title('Create')).toExist()
      await expect(
        PageHeadingComponent.intro('What would you like to create?')
      ).toExist()

      await FormComponent.inputLabel('Prototype').click()
      await FormComponent.submitButton('Next').click()
    })

    it('Should be able to enter prototype details', async () => {
      await expect(browser).toHaveTitle(
        'Create prototype | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)

      await expect(PageHeadingComponent.caption('Create')).toExist()
      await expect(PageHeadingComponent.title('Prototype')).toExist()
      await expect(PageHeadingComponent.intro()).toHaveText(
        'Built using GOV.UK Prototype kit.'
      )

      await FormComponent.inputLabel('Name').click()
      await browser.keys(testRepositoryName)

      await FormComponent.inputLabel('Owning Team').click()
      await browser.keys('Platform')

      await FormComponent.submitButton('Next').click()
    })

    it('Should be able to view prototype summary', async () => {
      await expect(browser).toHaveTitle(
        'Create prototype summary | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)

      await expect(PageHeadingComponent.caption('Create prototype')).toExist()
      await expect(PageHeadingComponent.title('Summary')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Information about the new prototype you are going to create'
        )
      ).toExist()

      await expect(await GovukSummaryListComponent.row('row-Kind')).toHaveText(
        'Prototype'
      )
      await expect(await GovukSummaryListComponent.row('row-Name')).toHaveText(
        testRepositoryName
      )
      await expect(
        await GovukSummaryListComponent.row('row-Templatetag')
      ).toHaveText('')
      await expect(
        await GovukSummaryListComponent.row('row-OwningTeam')
      ).toHaveText('Platform')

      await FormComponent.submitButton('Create').click()
    })

    it('Should be redirected to prototype status page', async () => {
      await expect(browser).toHaveTitle(
        `Creating ${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Service')).toExist()
      await expect(PageHeadingComponent.title(testRepositoryName)).toExist()
      await expect(StatusPage.overallProgress()).toHaveText('Creating')
    })

    it('Should see status page go to Created status', async () => {
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Service')).toExist()
      await expect(PageHeadingComponent.title(testRepositoryName)).toExist()

      await waitForCreateEntityStatus('Created')

      for (const resource of [
        'Repository',
        'TenantServices',
        'SquidProxy',
        'NginxUpstreams',
        'AppConfig',
        'GrafanaDashboard'
      ]) {
        await expect(await $(`[data-testid="${resource}-created"]`)).toExist()
      }

      await expect(browser).toHaveTitle(
        `Created ${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )

      await ServicesPage.link('Refresh').click()
    })

    it('Should see prototype About page', async () => {
      await expect(browser).toHaveTitle(
        `${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Service')).toExist()
      await expect(
        await PageHeadingComponent.title(testRepositoryName)
      ).toExist()
    })

    it('Should display prototype on services list page', async () => {
      await ServicesPage.open()

      await expect(browser).toHaveTitle(
        'Services | Core Delivery Platform - Portal'
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title('Services')).toExist()

      await expect(LinkComponent.link('app-link', testRepositoryName)).toExist()
    })

    it('Clicking on prototype on services list page should open service page', async () => {
      await LinkComponent.link('app-link', testRepositoryName).click()

      await expect(browser).toHaveTitle(
        `${testRepositoryName} microservice | Core Delivery Platform - Portal`
      )
    })
  })
})
