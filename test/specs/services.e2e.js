import { $, browser, expect } from '@wdio/globals'

import CreatePage from 'page-objects/create.page.js'
import DeployPage from 'page-objects/deploy.page.js'
import DeploymentsPage from 'page-objects/deployments.page.js'
import EntityTableComponent from 'components/entity-table.component.js'
import FormComponent from 'components/form.component'
import GovukSummaryListComponent from 'components/govuk-summary-list.component.js'
import HeadingComponent from 'components/heading.component.js'
import LinkComponent from 'components/link.component'
import LoginStubPage from 'page-objects/login-stub.page'
import PageHeadingComponent from 'components/page-heading.component'
import ServicesPage from 'page-objects/services.page'
import TabsComponent from 'components/tabs.component.js'
import UpdateDatabase from 'page-objects/update-database.page.js'
import { addPermission, deletePermission } from 'helpers/add-permission.js'
import { createMicroService } from 'helpers/create-micro-service.js'

const adminService = 'cdp-portal-frontend'
const postgresService = 'cdp-postgres-service'

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

      const adminServiceLink =
        await EntityTableComponent.entityLink(adminService)
      await adminServiceLink.waitForExist({ timeout: 5000 })
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

describe('Postgres service page', () => {
  describe('Logged in as "admin" with "restrictedTechPostgres" permission', () => {
    before(async () => {
      await addPermission('restrictedTechPostgres', 'Platform')
    })

    after(async () => {
      await deletePermission('restrictedTechPostgres')
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
      await browser.keys(postgresService)

      const postgresServiceLink =
        await EntityTableComponent.entityLink(postgresService)
      await postgresServiceLink.waitForExist({ timeout: 5000 })
    })

    it("Should be able to navigate to a 'Service' page via the list", async () => {
      await EntityTableComponent.entityLink(postgresService).click()

      await expect(browser).toHaveTitle(
        `${postgresService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.title(postgresService)).toExist()
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
    })

    it("Should be able to see the 'update' button in 'Database Changes' section", async () => {
      const $databaseChangesSection = $(`[data-testid="database-changes"]`)
      await expect($databaseChangesSection).toExist()

      const $updateButton = await LinkComponent.link(
        'update-button-0.1.0',
        'Update'
      )
      await expect($updateButton).toExist()
      await $updateButton.click()
    })

    it("Should be redirected to the 'Update Database' journey with prefilled form values", async () => {
      await expect(browser).toHaveTitle(
        'Update Database change details | Core Delivery Platform - Portal'
      )
      await expect(await UpdateDatabase.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Update database')).toExist()
      await expect(PageHeadingComponent.title('Details')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Provide the microservice service name, database update version and environment'
        )
      ).toExist()

      await expect(FormComponent.input('service-name')).toHaveValue(
        postgresService
      )
      await expect(FormComponent.input('version')).toHaveValue('0.1.0')
    })

    it('Should be able to complete the details form', async () => {
      await FormComponent.inputLabel('Environment').click()
      await browser.keys('dev')

      await FormComponent.submitButton('Next').click()
    })

    it("Should be on the 'Update Database' summary page", async () => {
      await expect(browser).toHaveTitle(
        'Update Database summary | Core Delivery Platform - Portal'
      )
      await expect(await UpdateDatabase.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Summary')).toExist()
      await expect(PageHeadingComponent.title('Update database')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Information about the database update you are about to run'
        )
      ).toExist()
    })

    it("'Update Database' summary page should contain expected details'", async () => {
      const summaryMarkup = await UpdateDatabase.summary().getHTML()

      await expect(summaryMarkup.includes(postgresService)).toBe(true)
      await expect(summaryMarkup.includes('0.1.0')).toBe(true)
      await expect(summaryMarkup.includes('Dev')).toBe(true)

      await FormComponent.submitButton('Update').click()
    })

    it('Should be redirected to the "Update Database" page', async () => {
      await expect(browser).toHaveTitle(
        `${postgresService} 0.1.0 database update - Dev | Core Delivery Platform - Portal`
      )
      await expect(await DeploymentsPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.caption('Database update')).toExist()
      await expect(PageHeadingComponent.title('Dev')).toExist()
      await expect(
        PageHeadingComponent.intro(
          `Database update for ${postgresService}, version 0.1.0`
        )
      ).toExist()

      const summaryList = await GovukSummaryListComponent.content().getHTML()

      await expect(summaryList.includes(postgresService)).toBe(true)
      await expect(summaryList.includes('dev')).toBe(true)
      await expect(summaryList.includes('0.1.0')).toBe(true)
      await expect(summaryList.includes('Liquibase')).toBe(true)

      await $(`[data-testid="succeeded-status-tag"]*=Succeeded`).waitForExist()

      const updatedSummaryList =
        await GovukSummaryListComponent.content().getHTML()

      await expect(
        updatedSummaryList.includes('https://logs.dev.cdp-int.defra.cloud')
      ).toBe(true)
    })

    it('Should be redirected to the Service page', async () => {
      await LinkComponent.link('app-link', postgresService).click()

      await expect(browser).toHaveTitle(
        `${postgresService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(PageHeadingComponent.title(postgresService)).toExist()
      await expect(PageHeadingComponent.caption('Service')).toExist()
    })

    it('Should see the update database change', async () => {
      const $databaseDetailsSection = await $(
        `[data-testid="database-details"]`
      ).getHTML()

      await expect($databaseDetailsSection.includes('0.1.0')).toBe(true)
    })
  })

  describe('When logged in as non-admin user without "restrictedTechPostgres" permission', () => {
    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
    })

    describe('When viewing a postgres service', () => {
      it("Should be able to navigate to a 'Service' page via the list", async () => {
        await ServicesPage.open()

        await expect(browser).toHaveTitle(
          'Services | Core Delivery Platform - Portal'
        )

        await expect(await ServicesPage.navIsActive()).toBe(true)
        await expect(PageHeadingComponent.title('Services')).toExist()

        await EntityTableComponent.entityLink(postgresService).click()

        await expect(browser).toHaveTitle(
          `${postgresService} microservice | Core Delivery Platform - Portal`
        )
        await expect(await ServicesPage.navIsActive()).toBe(true)
        await expect(PageHeadingComponent.title(postgresService)).toExist()
        await expect(PageHeadingComponent.caption('Service')).toExist()
      })

      it("Should not be able to see the 'update' button in 'Database Changes' section", async () => {
        const $databaseChangesSection = $(`[data-testid="database-changes"]`)
        await expect($databaseChangesSection).toExist()

        const $updateButton = await LinkComponent.link(
          'update-button-0.1.0',
          'Update'
        )
        await expect($updateButton).not.toExist()
      })
    })
  })
})
