import { browser, expect } from '@wdio/globals'

import TabsComponent from 'components/tabs.component'
import SplitPaneComponent from 'components/split-pane.component'
import ServicesPage from 'page-objects/services.page'
import ServicesSecretsPage from 'page-objects/services-secrets.page.js'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import PageHeadingComponent from 'components/page-heading.component.js'
import AdminPage from 'page-objects/admin.page.js'
import { ownerCanViewTab } from 'helpers/owner-can-view-tab.js'
import { describeWithAnnotations } from 'helpers/test-filters.js'

const adminOwnedService = 'cdp-portal-frontend'

describe('Services secrets page', () => {
  describeWithAnnotations('When logged out', ['@smoke'], () => {
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

    it('Should not be able to browse to secrets page', async () => {
      await ServicesSecretsPage.open(adminOwnedService)

      await expect(browser).toHaveTitle(
        'Unauthorized | Core Delivery Platform - Portal'
      )
      await expect(ErrorPage.title('401')).toExist()
      await expect(ErrorPage.message()).toHaveText('Unauthorized')
    })
  })

  describeWithAnnotations('When logged in as admin user', [], () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await ServicesPage.open(adminOwnedService)
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
    })

    it('And viewing a service you own, Should see expected tabs', async () => {
      await ownerCanViewTab('Service', adminOwnedService, 'About')
    })

    describeWithAnnotations(
      'When navigating to Secrets overview page',
      [],
      () => {
        it('Should be able to go direct to secrets overview', async () => {
          await ServicesSecretsPage.open(adminOwnedService)

          await expect(await PageHeadingComponent.caption('Secrets')).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await expect(TabsComponent.activeTab()).toHaveText('Secrets')
        })

        it('Should be an overview page of all secrets page', async () => {
          await ServicesPage.open(adminOwnedService)

          const secretsTab = await TabsComponent.tab('Secrets')
          await expect(secretsTab).toExist()
          await secretsTab.click()

          await expect(await PageHeadingComponent.caption('Secrets')).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await expect(TabsComponent.activeTab()).toHaveText('Secrets')
        })
      }
    )

    describeWithAnnotations(
      'When going to an Environment Secrets page',
      [],
      () => {
        it('Should be a page of that environments secrets', async () => {
          await ServicesSecretsPage.open(adminOwnedService, 'management')

          await expect(await PageHeadingComponent.caption('Secrets')).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await expect(ServicesSecretsPage.environmentHeader()).toHaveText(
            'Management secrets'
          )
          await expect(
            await SplitPaneComponent.subNavIsActive('management')
          ).toBe(true)
        })

        it('Should be navigable via sidebar to environment secrets', async () => {
          await ServicesSecretsPage.open(adminOwnedService)
          await expect(await ServicesPage.navIsActive()).toBe(true)
          await expect(await SplitPaneComponent.subNavIsActive('all')).toBe(
            true
          )
          await SplitPaneComponent.subNavItemLink('management').click()

          await expect(await PageHeadingComponent.caption('Secrets')).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await expect(ServicesSecretsPage.environmentHeader()).toHaveText(
            'Management secrets'
          )
          await expect(
            await SplitPaneComponent.subNavIsActive('management')
          ).toBe(true)
        })
      }
    )

    describeWithAnnotations(
      'When creating, updating and removing a secret',
      [],
      () => {
        const suffix = (Math.random() + 1)
          .toString(36)
          .substring(7)
          .toUpperCase()
        let keyName

        it('Should be able to create a new secret', async () => {
          keyName = `TEST_${suffix}`

          // Create a secret to test against
          await ServicesSecretsPage.open(adminOwnedService, 'management')

          await expect(await PageHeadingComponent.caption('Secrets')).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await ServicesSecretsPage.createSecretName().setValue(keyName)
          await ServicesSecretsPage.createSecretValue().setValue('test-value')
          await ServicesSecretsPage.createSecretButton().click()

          await expect(ServicesSecretsPage.secretCell(keyName)).toExist()
        })

        it('Should be listed as updated secrets', async () => {
          await ServicesSecretsPage.secretUpdate(keyName).click()

          await expect(
            await PageHeadingComponent.caption('Update Secret')
          ).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await ServicesSecretsPage.updateHeader().waitForExist()
          await ServicesSecretsPage.updateSecretValue().setValue(
            'test-updated-value'
          )
          await ServicesSecretsPage.updateSecretButton().click()

          await expect(await ServicesSecretsPage.secretCell(keyName)).toExist()
          await expect(
            await ServicesSecretsPage.secretActionCell(keyName)
          ).toExist()
          await expect(
            await ServicesSecretsPage.secretStatus(keyName, 'Secret available')
          ).toExist()
        })

        it('Should be able to remove secret', async () => {
          await ServicesSecretsPage.secretRemove(keyName).click()

          await expect(
            await PageHeadingComponent.caption('Remove Secret')
          ).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await ServicesSecretsPage.removeSecretButton().click()

          await expect(await PageHeadingComponent.caption('Secrets')).toExist()
          await expect(
            await PageHeadingComponent.title(adminOwnedService)
          ).toExist()

          await expect(
            await ServicesSecretsPage.secretCell(keyName)
          ).not.toExist()
        })
      }
    )

    after(async () => {
      await AdminPage.logOut()
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
