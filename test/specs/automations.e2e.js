import { browser, expect } from '@wdio/globals'

import TabsComponent from 'components/tabs.component'
import SplitPaneComponent from 'components/split-pane.component'
import ServicesPage from 'page-objects/services.page'
import ServicesAutomationsPage from 'page-objects/services-automations.page.js'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import PageHeadingComponent from 'components/page-heading.component.js'
import FormComponent from 'components/form.component.js'
import BannerComponent from 'components/banner.component.js'

const adminOwnedService = 'cdp-portal-frontend'
const adminOwnedTestSuite = 'cdp-env-test-suite'

describe('Services automations page', () => {
  describe('When logged out', () => {
    before(async () => {
      await ServicesPage.open(adminOwnedService)
    })

    it('Should be able to view service page', async () => {
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Service')).toExist()
      await expect(
        await PageHeadingComponent.title(adminOwnedService)
      ).toExist()
    })

    it('Should not be able to see tabs', async () => {
      await expect(TabsComponent.tab('About')).not.toExist()
      await expect(TabsComponent.tab('Automations')).not.toExist()
      await expect(TabsComponent.tab('Buckets')).not.toExist()
      await expect(TabsComponent.tab('Proxy')).not.toExist()
      await expect(TabsComponent.tab('Secrets')).not.toExist()
      await expect(TabsComponent.tab('Terminal')).not.toExist()
    })

    it('Should not be able to browse to automations page', async () => {
      await ServicesAutomationsPage.open(adminOwnedService)

      await expect(browser).toHaveTitle(
        'Unauthorized | Core Delivery Platform - Portal'
      )
      await expect(ErrorPage.title('401')).toExist()
      await expect(ErrorPage.message()).toHaveText('Unauthorized')
    })
  })

  describe('When logged in as admin user', () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await ServicesPage.open(adminOwnedService)
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
    })

    it('And viewing a service you own, should see expected tabs', async () => {
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(
        await PageHeadingComponent.caption('Automatic Deployments')
      ).toExist()
      await expect(
        await PageHeadingComponent.title(adminOwnedService)
      ).toExist()

      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Automations')).toExist()
      await expect(TabsComponent.tab('Buckets')).toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()
      await expect(TabsComponent.tab('Secrets')).toExist()
      await expect(TabsComponent.tab('Terminal')).toExist()
    })

    describe('When navigating to the Automations page', () => {
      it('Should default to the automatic deployments section', async () => {
        await TabsComponent.tab('Automations').click()

        const automaticDeploymentsTabHeader =
          await ServicesAutomationsPage.deploymentsHeading()

        await expect(automaticDeploymentsTabHeader).toExist()
        await expect(automaticDeploymentsTabHeader).toHaveText(
          'Automatic Deployments'
        )
      })

      it('Sidebar should have deployments highlighted', async () => {
        await expect(
          await SplitPaneComponent.subNavIsActive('deployments')
        ).toBe(true)
      })

      it('Should see automatic deployments form', async () => {
        await expect(FormComponent.legend('Environments')).toExist()

        await expect(FormComponent.inputLabel('Dev')).toExist()
        await expect(FormComponent.inputLabel('Test')).toExist()
        await expect(FormComponent.inputLabel('Ext-test')).toExist()

        await expect(FormComponent.submitButton('Save')).toExist()
      })

      it('automatic deployments should not be turned on in an environment', async () => {
        await expect(FormComponent.inputLabel('Dev')).not.toBeSelected()
        await expect(FormComponent.inputLabel('Test')).not.toBeSelected()
        await expect(FormComponent.inputLabel('Ext-test')).not.toBeSelected()
      })

      it('Should be able to turn on automatic deployments', async () => {
        await FormComponent.inputLabel('Test').click()
        await FormComponent.submitButton('Save').click()

        await expect(
          await BannerComponent.content(
            'Auto deployment details updated successfully'
          )
        ).toExist()
      })

      it('Automatic deploys should now be turned on in the test environment', async () => {
        const testEnvironmentInput = await FormComponent.inputLabel('Test')

        await expect(testEnvironmentInput).toBeSelected()
      })
    })

    describe('When navigating to the automatic test runs', () => {
      it('Should see automatic test runs heading', async () => {
        await SplitPaneComponent.subNavItemLink('test-runs').click()

        const automaticTestRunsHeader =
          await ServicesAutomationsPage.testRunsHeading()

        await expect(automaticTestRunsHeader).toExist()
        await expect(automaticTestRunsHeader).toHaveText('Automatic Test Runs')
      })

      it('sidebar should have deployments highlighted', async () => {
        await expect(await SplitPaneComponent.subNavIsActive('test-runs')).toBe(
          true
        )
      })

      it('Should see add test run form', async () => {
        const addTestRunFormHeading =
          await ServicesAutomationsPage.addTestRunFormHeading()
        await expect(addTestRunFormHeading).toExist()
        await expect(addTestRunFormHeading).toHaveText('Add Test Run')

        await expect(FormComponent.inputLabel('Test Suite')).toExist()

        await expect(FormComponent.legend('Environments')).toExist()

        await expect(FormComponent.inputLabel('Dev')).toExist()
        await expect(FormComponent.inputLabel('Test')).toExist()
        await expect(FormComponent.inputLabel('Ext-test')).toExist()

        await expect(FormComponent.submitButton('Add')).toExist()
      })

      it('Should not see any pre-existing automatic test runs', async () => {
        await expect(ServicesAutomationsPage.testRunsListNoResults()).toExist()
      })

      it('Should be able to add an automatic test run', async () => {
        await FormComponent.inputLabel('Test Suite').click()
        await browser.keys(adminOwnedTestSuite)
        await browser.keys('Enter')

        await FormComponent.inputLabel('Dev').click()
        await FormComponent.submitButton('Add').click()

        await expect(
          await BannerComponent.content('Auto test runs saved successfully')
        ).toExist()
      })

      it('Dev should have expected auto test run set up', async () => {
        const $testRunsFirsRow =
          await ServicesAutomationsPage.testRunsListRow(1)

        await expect($testRunsFirsRow).toHaveHTML(
          expect.stringContaining(adminOwnedTestSuite)
        )

        // TODO finish up tomorrow
      })
    })
  })

  describe('When logged in as a tenant user', () => {
    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await ServicesPage.open(adminOwnedService)
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
    })

    it('And viewing a service you do not own, Should see expected tabs', async () => {
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Service')).toExist()
      await expect(
        await PageHeadingComponent.title(adminOwnedService)
      ).toExist()

      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Buckets')).toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()

      await expect(TabsComponent.tab('Secrets')).not.toExist()
      await expect(TabsComponent.tab('Terminal')).not.toExist()
    })
  })
})
