import { browser, expect } from '@wdio/globals'
import TestSuitePage from 'page-objects/test-suite.page.js'
import LoginStubPage from 'page-objects/login-stub.page'
import BannerComponent from 'components/banner.component.js'
import TabsComponent from 'components/tabs.component.js'
import { waitForTestStatus } from 'helpers/test-suites.js'

describe('Run Test Suite', () => {
  const testSuiteName = 'cdp-env-test-suite'

  describe('When logged out', () => {
    before(async () => {
      await TestSuitePage.open(testSuiteName)
    })

    it('Should show the test run page without the run button', async () => {
      await expect(browser).toHaveTitle(
        `Test Suite - ${testSuiteName} | Core Delivery Platform - Portal`
      )
      await expect(TestSuitePage.selectEnvironment()).not.toBeDisplayed()
      await expect(TestSuitePage.startButton()).not.toBeDisplayed()
    })
  })

  describe('When logged in as admin user', () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await TestSuitePage.open(testSuiteName)
    })

    it('Should be on the test run page', async () => {
      await expect(browser).toHaveTitle(
        `Test Suite - ${testSuiteName} | Core Delivery Platform - Portal`
      )
      await expect(TestSuitePage.selectEnvironment()).toBeDisplayed()
      await expect(TestSuitePage.startButton()).toBeDisplayed()

      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Secrets')).toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()
    })

    it('should allow the test suite to be run in infra-dev', async () => {
      await expect(TestSuitePage.selectEnvironment()).toBeDisplayed()
      await TestSuitePage.selectEnvironment().selectByVisibleText('infra-dev')
      await TestSuitePage.startButton().click()
      await BannerComponent.content(
        'Test run requested successfully'
      ).isDisplayed()
      // Depending on polling intervals the in-progress set can be missed
      await waitForTestStatus('In-progress|Finished')
      await waitForTestStatus('Finished')
    })
  })

  describe('When logged in as tenant user who doesnt own the test-suite', () => {
    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await TestSuitePage.open(testSuiteName)
    })

    it('Should be on the test run page', async () => {
      await expect(browser).toHaveTitle(
        `Test Suite - ${testSuiteName} | Core Delivery Platform - Portal`
      )

      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Secrets')).not.toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()
    })

    it('should not allow the test suite to be run in infra-dev', async () => {
      await expect(TestSuitePage.selectEnvironment()).not.toBeDisplayed()
      await expect(TestSuitePage.startButton()).not.toBeDisplayed()
    })
  })
})
