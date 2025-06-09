import { $, browser, expect } from '@wdio/globals'

import CreatePage from 'page-objects/create.page'
import FormComponent from 'components/form.component'
import HeadingComponent from 'components/heading.component'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import TestSuitesPage from 'page-objects/test-suites.page'
import PageHeadingComponent from 'components/page-heading.component.js'
import TabsComponent from 'components/tabs.component.js'
import TestSuitePage from 'page-objects/test-suite.page.js'
import ServicesSecretsPage from 'page-objects/services-secrets.page.js'
import SplitPaneComponent from 'components/split-pane.component.js'
import EntityTableComponent from 'components/entity-table.component.js'
import ServicesPage from 'page-objects/services.page.js'
import { waitForCreateEntityStatus } from 'helpers/wait-for-create-entity-status.js'
import StatusPage from 'page-objects/status.page.js'

describe('Create journey tests', () => {
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

  describe('When logged in as admin user can see the create page', () => {
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
  })

  describe('When logged in as non-admin user can create journey tests', () => {
    const testRepositoryName = `jrny-test-suite-${new Date().getTime()}`

    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await CreatePage.open()
    })

    it('Should be on the "Create" page', async () => {
      await expect(browser).toHaveTitle(
        'Create | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title('Create')).toExist()
    })

    it('Should be able to choose journey tests', async () => {
      await expect(
        HeadingComponent.caption('What would you like to create?')
      ).toExist()

      await FormComponent.inputLabel('Journey Test Suite').click()
      await FormComponent.submitButton('Next').click()
    })

    it('Should be able to enter journey test details', async () => {
      await expect(browser).toHaveTitle(
        'Create journey test suite | Core Delivery Platform - Portal'
      )
      await expect(await CreatePage.navIsActive()).toBe(true)
      await expect(
        HeadingComponent.title('Create journey test suite')
      ).toExist()
      await expect(HeadingComponent.caption()).toHaveText(
        'Built using webdriver.io. Capable of running against a live environment or a docker compose setup as part of a GitHub workflow.'
      )

      await FormComponent.inputLabel('Name').click()
      await browser.keys(testRepositoryName)

      await FormComponent.inputLabel('Owning Team').click()
      await browser.keys('TenantTeam1')

      await FormComponent.submitButton('Next').click()
    })

    it('Should be able to view journey test summary', async () => {
      await expect(browser).toHaveTitle(
        'Summary journey test suite | Core Delivery Platform - Portal'
      )
      await expect(
        HeadingComponent.title('Summary journey test suite')
      ).toExist()
      await expect(
        HeadingComponent.caption(
          'Information about the new journey test suite you are going to create.'
        )
      ).toExist()

      await FormComponent.submitButton('Create').click()
    })

    it('Should be redirected to test-suite status page', async () => {
      await expect(browser).toHaveTitle(
        `Creating ${testRepositoryName} test suite | Core Delivery Platform - Portal`
      )
      await expect(await TestSuitesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Test Suite')).toExist()
      await expect(PageHeadingComponent.title(testRepositoryName)).toExist()
      await expect(StatusPage.overallProgress()).toHaveText('Creating')
    })

    it('Should see status page go to Created status', async () => {
      await expect(await TestSuitesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Test Suite')).toExist()
      await expect(PageHeadingComponent.title(testRepositoryName)).toExist()

      await waitForCreateEntityStatus('Created')

      for (const resource of [
        'Repository',
        'TenantServices',
        'SquidProxy',
        'AppConfig'
      ]) {
        await expect(await $(`[data-testid="${resource}-created"]`)).toExist()
      }

      await expect(browser).toHaveTitle(
        `Created ${testRepositoryName} test suite | Core Delivery Platform - Portal`
      )

      await ServicesPage.link('Refresh').click()
    })

    it('Should be on "Test Suite" About page with 2 tabs', async () => {
      await expect(await TestSuitePage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Test Suite')).toExist()
      await expect(
        await PageHeadingComponent.title(testRepositoryName)
      ).toExist()

      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Secrets')).toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()
    })

    it('Should be able to go to the "Secrets" overview', async () => {
      await TabsComponent.tab('Secrets').click()

      await expect(await PageHeadingComponent.caption('Secrets')).toExist()
      await expect(
        await PageHeadingComponent.title(testRepositoryName)
      ).toExist()

      await expect(TabsComponent.activeTab()).toHaveText('Secrets')
      await expect(await SplitPaneComponent.subNavIsActive('all')).toBe(true)
      await expect(await SplitPaneComponent.subNavItem('dev')).toExist()
      await expect(await SplitPaneComponent.subNavItem('test')).toExist()
      await expect(await SplitPaneComponent.subNavItem('perf-test')).toExist()
      await expect(await SplitPaneComponent.subNavItem('prod')).toExist()
      await expect(
        await SplitPaneComponent.subNavItem('infra-dev')
      ).not.toExist()
      await expect(
        await SplitPaneComponent.subNavItem('management')
      ).not.toExist()
    })

    it('Should be able to create a new secret', async () => {
      const keyName = 'TEST_SECRET'

      await SplitPaneComponent.subNavItem('dev').click()

      await expect($(`[data-testid="no-test-suite-secrets"]`)).toExist()
      await ServicesSecretsPage.createSecretName().click()
      await browser.keys(keyName)

      await ServicesSecretsPage.createSecretValue().click()
      await browser.keys('SomeValue')

      await ServicesSecretsPage.createSecretButton().click()

      await expect(await ServicesSecretsPage.secretCell(keyName)).toExist()
    })

    it('Should be able to view list of test-suites with new test-suite listed', async () => {
      // eslint-disable-next-line wdio/no-pause
      await browser.pause(1000) // Wait for the secret to be created
      await TestSuitesPage.open()

      await expect(browser).toHaveTitle(
        'Test Suites | Core Delivery Platform - Portal'
      )
      await expect(await TestSuitesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title('Test Suites')).toExist()

      await expect(
        EntityTableComponent.entityLink(testRepositoryName)
      ).toExist()
    })

    it('Clicking on new test-suite on list page should open test-suite page', async () => {
      await EntityTableComponent.entityLink(testRepositoryName).click()

      await expect(browser).toHaveTitle(
        `Test Suite - ${testRepositoryName} | Core Delivery Platform - Portal`
      )
    })
  })
})
