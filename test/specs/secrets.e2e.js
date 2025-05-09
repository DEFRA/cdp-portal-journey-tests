import { expect } from '@wdio/globals'

import TabsComponent from 'components/tabs.component'
import SplitPaneComponent from 'components/split-pane.component'
import ServicesPage from 'page-objects/services.page'
import SecretsPage from 'page-objects/secrets.page'
import ErrorPage from 'page-objects/error.page'
import LoginStubPage from 'page-objects/login-stub.page'
import PageHeadingComponent from 'components/page-heading.component.js'
import AdminPage from 'page-objects/admin.page.js'

const adminOwnedService = 'cdp-portal-frontend'

describe('Secrets feature', () => {
  describe('When not logged in', () => {
    before(async () => {
      await ServicesPage.open(`/${adminOwnedService}`)
      await expect(ServicesPage.logInLink()).toHaveText('Sign in')
    })

    it('Should not be any tabs on a "Service" page', async () => {
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(ServicesPage.pageHeading()).toHaveText(adminOwnedService)

      await expect(TabsComponent.tab('About')).not.toExist()
      await expect(TabsComponent.tab('Automation')).not.toExist()
      await expect(TabsComponent.tab('Buckets')).not.toExist()
      await expect(TabsComponent.tab('Proxy')).not.toExist()
      await expect(TabsComponent.tab('Secrets')).not.toExist()
      await expect(TabsComponent.tab('Terminal')).not.toExist()
    })

    it('Should not be able to browse to "Secrets" page', async () => {
      await SecretsPage.open(adminOwnedService)
      await expect(ErrorPage.title('401')).toExist()
      await expect(ErrorPage.message()).toHaveText('Unauthorized')
    })
  })

  describe('When logged in as admin user', () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
      await ServicesPage.open(`/${adminOwnedService}`)
      await expect(await ServicesPage.logOutLink()).toHaveText('Sign out')
    })

    it('And viewing a service you own, Should see expected tabs', async () => {
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Service')).toExist()
      await expect(
        await PageHeadingComponent.title(adminOwnedService)
      ).toExist()

      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Automation')).toExist()
      await expect(TabsComponent.tab('Buckets')).toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()
      await expect(TabsComponent.tab('Secrets')).toExist()
      await expect(TabsComponent.tab('Terminal')).toExist()
    })

    describe('When navigating to Secrets overview page', () => {
      it('Should be able to go direct to "Secrets" overview', async () => {
        await SecretsPage.open(adminOwnedService)

        await expect(await PageHeadingComponent.caption('Secrets')).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await expect(TabsComponent.activeTab()).toHaveText('Secrets')
      })

      it('Should be an overview page of all secrets page', async () => {
        await ServicesPage.open(`/${adminOwnedService}`)

        const secretsTab = await TabsComponent.tab('Secrets')
        await expect(secretsTab).toExist()
        await secretsTab.click()

        await expect(await PageHeadingComponent.caption('Secrets')).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await expect(TabsComponent.activeTab()).toHaveText('Secrets')
      })
    })

    describe('When going to an Environment Secrets page', () => {
      it('Should be a page of that environments secrets', async () => {
        await SecretsPage.open(adminOwnedService, 'management')

        await expect(await PageHeadingComponent.caption('Secrets')).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await expect(SecretsPage.environmentHeader()).toHaveText(
          'Management secrets'
        )
        await expect(
          await SplitPaneComponent.subNavIsActive('management')
        ).toBe(true)
      })

      it('Should be navigable via sidebar to environment secrets', async () => {
        await SecretsPage.open(adminOwnedService)
        await expect(await ServicesPage.navIsActive()).toBe(true)
        await expect(await SplitPaneComponent.subNavIsActive('all')).toBe(true)
        await SplitPaneComponent.subNavItemLink('management').click()

        await expect(await PageHeadingComponent.caption('Secrets')).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await expect(SecretsPage.environmentHeader()).toHaveText(
          'Management secrets'
        )
        await expect(
          await SplitPaneComponent.subNavIsActive('management')
        ).toBe(true)
      })
    })

    describe('When creating a new secret', () => {
      before(async () => {
        await SecretsPage.open(adminOwnedService, 'management')
      })
      const suffix = (Math.random() + 1).toString(36).substring(7).toUpperCase()
      const keyName = `TEST_${suffix}`

      it('Should be listed as available secret', async () => {
        await SecretsPage.createSecretName().setValue(keyName)
        await SecretsPage.createSecretValue().setValue('test-value')
        await SecretsPage.createSecretButton().click()

        await expect(await SecretsPage.secretCell(keyName)).toExist()
      })
    })

    describe('When updating a secret', () => {
      const suffix = (Math.random() + 1).toString(36).substring(7).toUpperCase()
      let keyName

      before(async () => {
        keyName = `TEST_${suffix}`

        // Create a secret to test against
        await SecretsPage.open(adminOwnedService, 'management')

        await expect(await PageHeadingComponent.caption('Secrets')).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await SecretsPage.createSecretName().setValue(keyName)
        await SecretsPage.createSecretValue().setValue('test-value')
        await SecretsPage.createSecretButton().click()

        await expect(SecretsPage.secretCell(keyName)).toExist()
      })

      it('Should be listed as updated secrets', async () => {
        await SecretsPage.secretAction(keyName).click()

        await expect(
          await PageHeadingComponent.caption('Update Secret')
        ).toExist()
        await expect(
          await PageHeadingComponent.title(adminOwnedService)
        ).toExist()

        await SecretsPage.updateHeader().waitForExist()
        await SecretsPage.updateSecretValue().setValue('test-updated-value')
        await SecretsPage.updateSecretButton().click()

        await expect(await SecretsPage.secretCell(keyName)).toExist()
        await expect(await SecretsPage.secretActionCell(keyName)).toExist()
        await expect(
          await SecretsPage.secretStatus(keyName, 'Secret available')
        ).toExist()
      })
    })

    after(async () => {
      await AdminPage.logOut()
    })
  })

  describe('When logged in as a tenant user', () => {
    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await ServicesPage.open(`/${adminOwnedService}`)
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
