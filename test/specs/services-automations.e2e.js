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
import LinkComponent from 'components/link.component.js'
import { ownerCanViewTab } from 'helpers/owner-can-view-tab.js'

const adminOwnedService = 'cdp-portal-frontend'
const adminOwnedTestSuite = 'cdp-env-test-suite'

async function resetAutomationsForms() {
  // Reset auto deployments form
  await LoginStubPage.loginAsAdmin()
  await ServicesAutomationsPage.open(adminOwnedService)

  const $checkboxInputs = await Promise.all([
    FormComponent.inputByValue('infra-dev'),
    FormComponent.inputByValue('management'),
    FormComponent.inputByValue('dev'),
    FormComponent.inputByValue('test'),
    FormComponent.inputByValue('ext-test')
  ])

  // Uncheck any checked, check box inputs
  for await (const $checkbox of $checkboxInputs) {
    if (await $checkbox.isSelected()) {
      await $checkbox.click()
    }
  }

  await FormComponent.submitButton('Save').click()

  // Reset auto test runs form
  await ServicesAutomationsPage.openTestRuns(adminOwnedService)
  const $noResultsMessage =
    await ServicesAutomationsPage.testRunsListNoResults()
  const noTestRunsMessage = await $noResultsMessage.isExisting()

  if (!noTestRunsMessage) {
    // Just accounting for there being 1 test run row and 1 remove button
    await LinkComponent.link('app-link', 'Remove').click()
    await FormComponent.submitButton('Remove test run').click()
  }
  await LoginStubPage.logout()
}

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

    it('Should not be able to see owner tabs', async () => {
      await ServicesPage.hasNoTabs()
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
      await resetAutomationsForms()

      await LoginStubPage.loginAsAdmin()
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
      await ServicesPage.open(adminOwnedService)
    })

    it('And viewing a service you own, should see expected tabs', async () => {
      await ownerCanViewTab('Service', adminOwnedService, 'About')
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

        await expect(FormComponent.inputLabel('Infra-dev')).toExist()
        await expect(FormComponent.inputLabel('Management')).toExist()
        await expect(FormComponent.inputLabel('Dev')).toExist()
        await expect(FormComponent.inputLabel('Test')).toExist()
        await expect(FormComponent.inputLabel('Ext-test')).toExist()

        await expect(FormComponent.inputLabel('Prod')).not.toExist()

        await expect(FormComponent.submitButton('Save')).toExist()
      })

      it('automatic deployments should not be turned on in an environment', async () => {
        await expect(FormComponent.inputLabel('Infra-dev')).not.toBeSelected()
        await expect(FormComponent.inputLabel('Management')).not.toBeSelected()
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
        await expect(await FormComponent.inputByValue('test')).toBeSelected()
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

        await expect(FormComponent.inputLabel('Infra-dev')).toExist()
        await expect(FormComponent.inputLabel('Management')).toExist()
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
        await browser.keys(adminOwnedTestSuite) // Typing the exact name of the test suite will automatically choose it. No need to press enter or click the result

        await FormComponent.inputLabel('Dev').click()
        await FormComponent.submitButton('Add').click()

        await expect(
          await BannerComponent.content('Auto test runs updated successfully')
        ).toExist()
      })

      it('Should have expected auto test run set up', async () => {
        const $testRunsFirsRow =
          await ServicesAutomationsPage.testRunsListRow(1)

        await expect($testRunsFirsRow).toHaveHTML(
          expect.stringContaining(adminOwnedTestSuite)
        )
        await expect($testRunsFirsRow).toHaveHTML(
          expect.stringContaining('Test-suite')
        )

        await expect(
          await ServicesAutomationsPage.testSetupForEnvironment(1, 'dev')
        ).toExist()

        await expect($testRunsFirsRow).toHaveHTML(
          expect.stringContaining('Update')
        )
        await expect($testRunsFirsRow).toHaveHTML(
          expect.stringContaining('Remove')
        )
      })

      it('Should be able to updated automated test suite', async () => {
        await LinkComponent.link('app-link', 'Update').click()

        const updateTestRunHeading =
          await ServicesAutomationsPage.updateTestRunHeading()
        await expect(updateTestRunHeading).toExist()
        await expect(updateTestRunHeading).toHaveText('Update Test Run')

        const updateTestRunPage =
          await ServicesAutomationsPage.updateTestRunPage()

        await expect(updateTestRunPage).toHaveHTML(
          expect.stringContaining(adminOwnedTestSuite)
        )
        await expect(updateTestRunPage).toHaveHTML(
          expect.stringContaining('Test-suite')
        )

        await expect(await FormComponent.inputByValue('dev')).toBeSelected()
        await expect(
          await FormComponent.inputByValue('test')
        ).not.toBeSelected()

        await FormComponent.inputLabel('Infra-dev').click()
        await FormComponent.submitButton('Update').click()

        await expect(
          await BannerComponent.content('Test run updated')
        ).toExist()
      })

      it('Should have expected updated auto test run set up', async () => {
        const automaticTestRunsHeader =
          await ServicesAutomationsPage.testRunsHeading()
        await expect(automaticTestRunsHeader).toExist()
        await expect(automaticTestRunsHeader).toHaveText('Automatic Test Runs')

        const $testRunsFirstRow =
          await ServicesAutomationsPage.testRunsListRow(1)

        await expect($testRunsFirstRow).toHaveHTML(
          expect.stringContaining(adminOwnedTestSuite)
        )
        await expect($testRunsFirstRow).toHaveHTML(
          expect.stringContaining('Test-suite')
        )

        await expect(
          await ServicesAutomationsPage.testSetupForEnvironment(1, 'dev')
        ).toExist()
        await expect(
          await ServicesAutomationsPage.testSetupForEnvironment(1, 'infra-dev')
        ).toExist()

        await expect($testRunsFirstRow).toHaveHTML(
          expect.stringContaining('Update')
        )
        await expect($testRunsFirstRow).toHaveHTML(
          expect.stringContaining('Remove')
        )
      })

      it('Should be able to remove automated test suite', async () => {
        await LinkComponent.link('app-link', 'Remove').click()

        const removeTestRunHeading =
          await ServicesAutomationsPage.removeTestRunHeading()
        await expect(removeTestRunHeading).toExist()
        await expect(removeTestRunHeading).toHaveText('Remove Test Run')

        const removeTestRunPage =
          await ServicesAutomationsPage.removeTestRunPage()

        await expect(removeTestRunPage).toHaveHTML(
          expect.stringContaining(adminOwnedTestSuite)
        )
        await expect(removeTestRunPage).toHaveHTML(
          expect.stringContaining('Dev')
        )

        await FormComponent.submitButton('Remove test run').click()

        await expect(
          await BannerComponent.content('Test run removed from service')
        ).toExist()
      })

      it('Automatic test run should be removed', async () => {
        await expect(ServicesAutomationsPage.testRunsListNoResults()).toExist()
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

      await expect(TabsComponent.tab('Automations')).not.toExist()
      await expect(TabsComponent.tab('Maintenance')).not.toExist()
      await expect(TabsComponent.tab('Secrets')).not.toExist()
      await expect(TabsComponent.tab('Terminal')).not.toExist()
    })
  })
})
