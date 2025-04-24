import { $, browser, expect } from '@wdio/globals'

import PageHeadingComponent from 'components/page-heading.component'
import ServicesPage from 'page-objects/services.page'
import LoginStubPage from 'page-objects/login-stub.page'
import TabsComponent from 'components/tabs.component.js'
import LinkComponent from 'components/link.component'
import DeployPage from 'page-objects/deploy.page.js'
import HeadingComponent from 'components/heading.component.js'
import FormComponent from 'components/form.component'
import CreatePage from 'page-objects/create.page.js'
import { createMicroService } from 'helpers/create-micro-service.js'
import EntityTableComponent from 'components/entity-table.component.js'

const adminService = 'cdp-portal-frontend'

describe('Services page', () => {
  describe('When logged in as admin user', () => {
    before(async () => {
      await LoginStubPage.loginAsAdmin()
    })

    it("Should be on the 'Services' list page", async () => {
      await ServicesPage.open()

      await expect(browser).toHaveTitle(
        'Services | Core Delivery Platform - Portal'
      )

      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.title('Services')).toExist()
    })

    it("Should be able to search for a service on the 'Service' page", async () => {
      await ServicesPage.serviceSearchBox().click()
      await browser.keys(adminService)

      await expect(EntityTableComponent.entityLink(adminService)).toExist()
    })

    it("Should navigate to a 'Service' page via the result", async () => {
      await EntityTableComponent.entityLink(adminService).click()

      await expect(browser).toHaveTitle(
        `${adminService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.title(adminService)).toExist()
      await expect(PageHeadingComponent.caption('Service')).toExist()
    })

    it("Should be able to see the expected admin tabs on 'Service' page", async () => {
      await expect(TabsComponent.activeTab()).toHaveText('About')
      await expect(TabsComponent.tab('Automation')).toExist()
      await expect(TabsComponent.tab('Buckets')).toExist()
      await expect(TabsComponent.tab('Proxy')).toExist()
      await expect(TabsComponent.tab('Secrets')).toExist()
      await expect(TabsComponent.tab('Terminal')).toExist()
    })

    it("Should be able to see the 'deploy' button in 'Publish Images' section", async () => {
      const $publishedImagesSection = $(`[data-testid="published-images"]`)
      await expect($publishedImagesSection).toExist()

      const $deployButton = await LinkComponent.link('deploy-button', 'Deploy')
      await expect($deployButton).toExist()

      $deployButton.click()
    })

    it('Should be redirected to the deploy journey', async () => {
      await expect(browser).toHaveTitle(
        'Deploy Service details | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)
      await expect(HeadingComponent.title('Details')).toExist()
      await expect(
        HeadingComponent.caption(
          'Provide the microservice image name, version and environment to deploy to.'
        )
      ).toExist()
      await expect(FormComponent.input('image-name')).toHaveValue(adminService)
    })
  })

  describe('When logged in as non-admin user', () => {
    const testRepositoryName = `test-repo-${new Date().getTime()}`
    const teamName = 'TenantTeam1'

    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await CreatePage.open()
      await createMicroService(testRepositoryName, teamName)
    })

    describe('When viewing microservice as serviceOwner', () => {
      it("Should navigate to new microservice 'Service' page", async () => {
        await ServicesPage.open(`/${testRepositoryName}`)
        await expect(browser).toHaveTitle(
          `${testRepositoryName} microservice | Core Delivery Platform - Portal`
        )
        await expect(await ServicesPage.navIsActive()).toBe(true)
        await expect(PageHeadingComponent.title(testRepositoryName)).toExist()
        await expect(PageHeadingComponent.caption('Service')).toExist()
      })

      it("Should be able to see the expected non-admin tabs on 'Service' page", async () => {
        await expect(TabsComponent.activeTab()).toHaveText('About')
        await expect(TabsComponent.tab('Automation')).toExist()
        await expect(TabsComponent.tab('Buckets')).toExist()
        await expect(TabsComponent.tab('Proxy')).toExist()
        await expect(TabsComponent.tab('Secrets')).toExist()
        await expect(TabsComponent.tab('Terminal')).toExist()
      })

      it("Should be able to see the 'deploy' button in 'Publish Images' section", async () => {
        const $publishedImagesSection = $(`[data-testid="published-images"]`)
        await expect($publishedImagesSection).toExist()

        const $deployButton = await LinkComponent.link(
          'deploy-button',
          'Deploy'
        )
        await expect($deployButton).toExist()

        $deployButton.click()
      })

      it('Should be redirected to the deploy journey', async () => {
        await expect(browser).toHaveTitle(
          'Deploy Service details | Core Delivery Platform - Portal'
        )
        await expect(await DeployPage.navIsActive()).toBe(true)
        await expect(HeadingComponent.title('Details')).toExist()
        await expect(
          HeadingComponent.caption(
            'Provide the microservice image name, version and environment to deploy to.'
          )
        ).toExist()
        await expect(FormComponent.input('image-name')).toHaveValue(
          testRepositoryName
        )
      })
    })
  })
})
