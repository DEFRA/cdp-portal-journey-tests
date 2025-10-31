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
import {
  deployService,
  waitForDeploymentToFinish
} from 'helpers/deploy-service.js'
import upperFirst from 'lodash/upperFirst.js'
import kebabCase from 'lodash/kebabCase.js'
import { unshutterService } from 'helpers/unshutter-service.js'
import { oneMinute } from 'helpers/timeout.js'
import { describeWithAnnotations } from 'helpers/test-filters.js'

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

describe('Services maintenance - shuttering', () => {
  describeWithAnnotations('When logged out', [], () => {
    it('Should not be able to browse to maintenance page', async () => {
      await ServicesMaintenancePage.open(adminOwnedService)
      await expect(browser).toHaveTitle(
        'Unauthorized | Core Delivery Platform - Portal'
      )
      await expect(ErrorPage.title('401')).toExist()
      await expect(ErrorPage.message()).toHaveText('Unauthorized')
    })
  })

  describeWithAnnotations('When shuttering as admin user', [], () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
      await ServicesMaintenancePage.open(adminOwnedService)
      // Ensure the service is in the correct shuttered state
      await unshutterService(adminOwnedService, 2)
    })

    it('And viewing a service you own, should be able to see the maintenance page', async () => {
      await ownerCanViewTab('Shuttering', adminOwnedService, 'Maintenance')
    })

    describeWithAnnotations(
      'When navigating to the Maintenance page',
      [],
      () => {
        it('Should see shuttering and undeployments sections', async () => {
          await expect(ServicesMaintenancePage.shutteringHeading()).toExist()
          await expect(ServicesMaintenancePage.shutteringPanel()).toExist()
          await expect(ServicesMaintenancePage.undeployHeading()).toExist()
          await expect(ServicesMaintenancePage.undeployPanel()).toExist()
        })

        it('Shuttering panel should contain expected detail', async () => {
          const $shutteringPanel =
            await ServicesMaintenancePage.shutteringPanel()

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
            firstShutterStatus: 'Shuttered',
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
            firstShutterStatus: 'Shuttered',
            secondShutterStatus: 'Pending',
            thirdShutterStatus: 'Active'
          })

          await $('[data-testid="shuttered-status-2"]*=Shuttered').waitForExist(
            {
              timeout: oneMinute // Wait for the shuttered status to change in stubs
            }
          )
        })

        it('Should be able to unshutter the service', async () => {
          await ServicesMaintenancePage.open(adminOwnedService)

          await ownerCanViewTab('Shuttering', adminOwnedService, 'Maintenance')

          await checkShutterStatus({
            firstShutterStatus: 'Shuttered',
            secondShutterStatus: 'Shuttered',
            thirdShutterStatus: 'Active'
          })

          const $shutterLink = await LinkComponent.link(
            'shutter-link-2',
            'Unshutter'
          )

          await expect($shutterLink).toExist()

          $shutterLink.click()
        })

        it('Confirm unshutter panel should contain expected detail', async () => {
          const $confirmShutterPanel =
            await ServicesMaintenancePage.confirmShutterPanel()

          await expect($confirmShutterPanel).toHaveHTML(
            expect.stringContaining('Unshutter the following service url')
          )
          await expect($confirmShutterPanel).toHaveHTML(
            expect.stringContaining('https://portal.cdp-int.defra.cloud')
          )
          await expect($confirmShutterPanel).toHaveHTML(
            expect.stringContaining('Management')
          )
          await expect($confirmShutterPanel).toHaveHTML(
            expect.stringContaining('Shuttered')
          )
          await expect($confirmShutterPanel).toHaveHTML(
            expect.stringContaining('Admin User')
          )

          await expect(FormComponent.submitButton('Unshutter url')).toExist()
        })

        it('Should be able to see service unshutter', async () => {
          await (await FormComponent.submitButton('Unshutter url')).click()

          await ownerCanViewTab('Shuttering', adminOwnedService, 'Maintenance')

          await checkShutterStatus({
            firstShutterStatus: 'Shuttered',
            secondShutterStatus: 'Pending',
            thirdShutterStatus: 'Active'
          })

          await $('[data-testid="shuttered-status-2"]*=Active').waitForExist({
            timeout: oneMinute // Wait for the shuttered status to change in stubs
          })
        })
      }
    )
  })
})

describeWithAnnotations('Services maintenance - undeploy', [], () => {
  describeWithAnnotations('When undeploying as an admin', [], () => {
    const options = {
      imageName: 'cdp-portal-frontend',
      version: '0.1.0',
      environment: 'perf-test',
      instanceCount: '1',
      cpuFormValue: '1024',
      memoryFormValue: '2048',
      cpuText: '1 vCPU',
      memoryText: '2 GB'
    }

    it('Should deploy a service so that we can undeploy it', async () => {
      await LoginStubPage.loginAsAdmin()
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
      await deployService(options)
      await ServicesMaintenancePage.open(options.imageName)
    })

    it('Should be able to undeploy the service', async () => {
      await ServicesMaintenancePage.open(options.imageName)
      const $undeployLink = await LinkComponent.link(
        'undeploy-link-1',
        'Undeploy'
      )
      await expect($undeployLink).toExist()
      $undeployLink.click()
    })

    it('Should be on the undeploy confirm page', async () => {
      const confirmUndeployPanel =
        await ServicesMaintenancePage.confirmUndeployPanel()

      await expect(confirmUndeployPanel).toHaveHTML(
        expect.stringContaining('Undeploy the following service')
      )
      await expect(confirmUndeployPanel).toHaveHTML(
        expect.stringContaining(options.imageName)
      )
      await expect(confirmUndeployPanel).toHaveHTML(
        expect.stringContaining(options.environment)
      )
      await expect(confirmUndeployPanel).toHaveHTML(
        expect.stringContaining(options.version)
      )
      await expect(confirmUndeployPanel).toHaveHTML(
        expect.stringContaining('Admin User')
      )

      await expect(FormComponent.submitButton('Undeploy service')).toExist()
    })

    it('Should be able to see the service undeploy', async () => {
      await FormComponent.submitButton('Undeploy service').click()

      const formattedEnvironment = upperFirst(kebabCase(options.environment))
      await expect(browser).toHaveTitle(
        `${options.imageName} ${options.version} deployment - ${formattedEnvironment} | Core Delivery Platform - Portal`
      )

      await waitForDeploymentToFinish('Undeployed')
    })
  })

  describeWithAnnotations('When logged in as a tenant user', [], () => {
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
      await expect(TabsComponent.tab('Proxy')).toExist()
      await expect(TabsComponent.tab('Resources')).toExist()

      await expect(TabsComponent.tab('Automations')).not.toExist()
      await expect(TabsComponent.tab('Maintenance')).not.toExist()
      await expect(TabsComponent.tab('Secrets')).not.toExist()
      await expect(TabsComponent.tab('Terminal')).not.toExist()
    })
  })
})
