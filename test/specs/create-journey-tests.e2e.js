import { browser, expect } from '@wdio/globals'

import CreatePage from 'page-objects/create.page'
import FormComponent from 'components/form.component'
import HeadingComponent from 'components/heading.component'
import BannerComponent from 'components/banner.component'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import TestSuitesPage from 'page-objects/test-suites.page'

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

  describe('When logged in as admin user', () => {
    const testRepositoryName = `jrny-test-suite-${new Date().getTime()}`

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
      await browser.keys('Platform')

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

    it('Should be redirected to create journey test suite status page', async () => {
      await expect(browser).toHaveTitle(
        `Creating ${testRepositoryName} test suite | Core Delivery Platform - Portal`
      )
      await expect(
        await BannerComponent.content('Journey test suite creation has started')
      ).toExist()
      await expect(await TestSuitesPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title(testRepositoryName)).toExist()
      await expect(
        HeadingComponent.caption(
          `Creating the ${testRepositoryName} test suite.`
        )
      ).toExist()
      await expect(TestSuitesPage.overallProgress()).toHaveText('In-progress')
    })

    it('Should be redirected to "success" create journey test suite page', async () => {
      await expect(browser).toHaveTitle(
        `Created ${testRepositoryName} test suite | Core Delivery Platform - Portal`
      )
      await expect(await TestSuitesPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title(testRepositoryName)).toExist()
      await expect(
        HeadingComponent.caption(
          `Created the ${testRepositoryName} test suite.`
        )
      ).toExist()

      for (const statusTag of [
        'github-repository',
        'proxy',
        'infrastructure'
      ]) {
        await $(
          `[data-testid="${statusTag}-status-tag"]*=Success`
        ).waitForExist()
      }

      await TestSuitesPage.link('new test suite page').click()
    })
  })
})
