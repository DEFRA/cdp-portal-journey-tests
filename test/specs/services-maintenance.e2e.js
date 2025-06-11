import { browser, expect } from '@wdio/globals'

import TabsComponent from 'components/tabs.component'
import ServicesPage from 'page-objects/services.page'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import PageHeadingComponent from 'components/page-heading.component.js'
import FormComponent from 'components/form.component.js'
import BannerComponent from 'components/banner.component.js'
import LinkComponent from 'components/link.component.js'
import ServicesMaintenancePage from 'page-objects/services-maintenance.page.js'
import { ownerCanViewTab } from 'helpers/owner-can-view-tab.js'

const adminOwnedService = 'cdp-portal-frontend'

const checkShutterStatus = async ({
  firstShutterStatus,
  secondShutterStatus,
  thirdShutterStatus
}) => {
  const $firstShutterStatus = await $('[data-testid="shuttered-status-1"]')
  await expect($firstShutterStatus).toHaveText(firstShutterStatus)

  const $secondShutterStatus = await $('[data-testid="shuttered-status-2"]')
  await expect($secondShutterStatus).toHaveText(secondShutterStatus)

  const $thirdShutterStatus = await $('[data-testid="shuttered-status-3"]')
  await expect($thirdShutterStatus).toHaveText(thirdShutterStatus)
}

describe('Services maintenance page', () => {
  describe('When logged out', () => {
    it('Should not be able to browse to maintenance page', async () => {
      await ServicesMaintenancePage.open(adminOwnedService)
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
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
      await ServicesMaintenancePage.open(adminOwnedService)
    })

    it('And viewing a service you own, should be able to see the maintenance page', async () => {
      await ownerCanViewTab('Shuttering', adminOwnedService, 'Maintenance')
    })

    describe('When navigating to the Maintenance page', () => {
      it('Should see shuttering and undeployments sections', async () => {
        await expect(ServicesMaintenancePage.shutteringHeading()).toExist()
        await expect(ServicesMaintenancePage.shutteringPanel()).toExist()
        await expect(ServicesMaintenancePage.undeployHeading()).toExist()
        await expect(ServicesMaintenancePage.undeployPanel()).toExist()
      })

      it('Shuttering panel should contain expected detail', async () => {
        const $shutteringPanel = await ServicesMaintenancePage.shutteringPanel()

        await expect($shutteringPanel).toHaveHTML(
          expect.stringContaining('https://portal-test.cdp-int.defra.cloud')
        )
        await expect($shutteringPanel).toHaveHTML(
          expect.stringContaining('https://portal.cdp-int.defra.cloud')
        )
        await expect($shutteringPanel).toHaveHTML(
          expect.stringContaining('https://portal.defra.gov')
        )

        await checkShutterStatus({
          firstShutterStatus: 'Active',
          secondShutterStatus: 'Active',
          thirdShutterStatus: 'Active'
        })
      })

      it('Should be able to shutter a service url', async () => {
        const $shutterLink = await LinkComponent.link(
          'shutter-link-2',
          'Shutter'
        )
        await expect($shutterLink).toExist()

        $shutterLink.click()
      })

      it('Should be on the shutter confirm page', async () => {
        await expect(await ServicesMaintenancePage.navIsActive()).toBe(true)
        await expect(
          await PageHeadingComponent.caption('Confirm shutter')
        ).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await expect(TabsComponent.activeTab()).toHaveText('Maintenance')
      })

      it('Confirm shutter panel should contain expected detail', async () => {
        const $confirmShutterPanel =
          await ServicesMaintenancePage.confirmShutterPanel()

        await expect($confirmShutterPanel).toHaveHTML(
          expect.stringContaining('Shutter the following service url')
        )
        await expect($confirmShutterPanel).toHaveHTML(
          expect.stringContaining('https://portal.cdp-int.defra.cloud')
        )
        await expect($confirmShutterPanel).toHaveHTML(
          expect.stringContaining('Management')
        )
        await expect($confirmShutterPanel).toHaveHTML(
          expect.stringContaining('Active')
        )
        await expect($confirmShutterPanel).toHaveHTML(
          expect.stringContaining('Admin User')
        )

        await expect(FormComponent.submitButton('Shutter url')).toExist()
      })

      it('Should be able to shutter the service', async () => {
        await FormComponent.submitButton('Shutter url').click()

        await ownerCanViewTab('Shuttering', adminOwnedService, 'Maintenance')

        await expect(
          await BannerComponent.content(
            'Shutter requested for https://portal.cdp-int.defra.cloud'
          )
        ).toExist()

        await checkShutterStatus({
          firstShutterStatus: 'Active',
          secondShutterStatus: 'Pending',
          thirdShutterStatus: 'Active'
        })

        await $('[data-testid="shuttered-status-2"]*=Shuttered').waitForExist({
          timeout: 20000 // Wait for the shuttered status to change in stubs
        })
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
