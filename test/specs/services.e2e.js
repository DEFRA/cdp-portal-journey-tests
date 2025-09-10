import { $, browser, expect } from '@wdio/globals'

import CreatePage from 'page-objects/create.page.js'
import DeployPage from 'page-objects/deploy.page.js'
import DeploymentsPage from 'page-objects/deployments.page.js'
import FormComponent from 'components/form.component'
import GovukSummaryListComponent from 'components/govuk-summary-list.component.js'
import LinkComponent from 'components/link.component'
import LoginStubPage from 'page-objects/login-stub.page'
import PageHeadingComponent from 'components/page-heading.component'
import ServicesPage from 'page-objects/services.page'
import TabsComponent from 'components/tabs.component.js'
import ApplyChangelog from 'page-objects/apply-changelog.page.js'
import { createMicroService } from 'helpers/create-micro-service.js'
import {
  addPermissionToTeam,
  createPermission,
  deletePermission
} from 'helpers/permissions.js'

const adminService = 'cdp-portal-frontend'
const adminServiceVersion = '0.172.0'
const postgresService = 'cdp-postgres-service'
const postgresServiceVersion = '0.1.0'

async function checkRowExistsWithStar(content = 'cdp-portal-backend', index) {
  const backendRow = await ServicesPage.row(
    'app-entity-table-row-' + index,
    content
  )
  await expect(await backendRow).toExist()
  await expect(await backendRow.$(`svg[data-testid="app-star-icon"]`)).toExist()
}

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
      await expect(await PageHeadingComponent.title('Services')).toExist()
    })

    it('Should be able to see a star beside Platform Services', async () => {
      await checkRowExistsWithStar('cdp-portal-backend', 1)
      await checkRowExistsWithStar('cdp-portal-frontend', 2)
      await checkRowExistsWithStar('cdp-postgres-service', 3)
      await checkRowExistsWithStar('cdp-self-service-ops', 4)
      await checkRowExistsWithStar('cdp-service-prototype', 5)

      const adminServiceLink = await LinkComponent.link(
        'app-link',
        adminService
      )
      await adminServiceLink.waitForExist({ timeout: 5000 })
    })

    it("Should be able to search for a service on the 'Service' page", async () => {
      await ServicesPage.serviceSearchBox().click()
      await browser.keys(adminService)

      const adminServiceLink = await LinkComponent.link(
        'app-link',
        adminService
      )
      await adminServiceLink.waitForExist({ timeout: 5000 })
    })

    it("Should navigate to a 'Service' page via the result", async () => {
      await LinkComponent.link('app-link', adminService).click()

      await expect(browser).toHaveTitle(
        `${adminService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title(adminService)).toExist()
      await expect(await PageHeadingComponent.caption('Service')).toExist()
    })

    it("Should be able to see the expected admin tabs on 'Service' page", async () => {
      await expect(TabsComponent.activeTab()).toHaveText('About')
      await ServicesPage.hasOwnerTabs()
    })

    it("Should be able to see the 'deploy' button in 'Publish Images' section", async () => {
      const $publishedImagesSection = $(`[data-testid="published-images"]`)
      await expect($publishedImagesSection).toExist()

      const $deployButton = await LinkComponent.link(
        `deploy-button-${adminServiceVersion}`,
        'Deploy'
      )
      await expect($deployButton).toExist()

      $deployButton.click()
    })

    it('Should be redirected to the deploy journey', async () => {
      await expect(browser).toHaveTitle(
        'Deploy service details | Core Delivery Platform - Portal'
      )
      await expect(await DeployPage.navIsActive()).toBe(true)

      await expect(
        await PageHeadingComponent.caption('Deploy service')
      ).toExist()
      await expect(await PageHeadingComponent.title('Details')).toExist()

      const $pageHeadingIntro = PageHeadingComponent.intro()
      await expect($pageHeadingIntro).toExist()
      await expect($pageHeadingIntro).toHaveHTML(
        expect.stringContaining(
          'Provide the microservice image name, version and environment to deploy to'
        )
      )

      await expect(FormComponent.input('image-name')).toHaveValue(adminService)
      await expect(FormComponent.input('version')).toHaveValue(
        adminServiceVersion
      )
    })
  })

  describe('When logged in as non-admin user', () => {
    const testRepositoryName = `test-repo-${new Date().getTime()}`
    const teamName = 'TenantTeam1'
    const artifactVersion = '0.3.0'

    before(async () => {
      await LoginStubPage.loginAsNonAdmin()
      await CreatePage.open()
      await createMicroService(testRepositoryName, teamName)
    })

    describe('When viewing microservice as serviceOwner', () => {
      it("Should navigate to new microservice 'Service' page", async () => {
        await ServicesPage.open(testRepositoryName)
        await expect(browser).toHaveTitle(
          `${testRepositoryName} microservice | Core Delivery Platform - Portal`
        )
        await expect(await ServicesPage.navIsActive()).toBe(true)
        await expect(
          await PageHeadingComponent.title(testRepositoryName)
        ).toExist()
        await expect(await PageHeadingComponent.caption('Service')).toExist()
      })

      it("Should be able to see the expected non-admin tabs on 'Service' page", async () => {
        await expect(TabsComponent.activeTab()).toHaveText('About')
        await expect(TabsComponent.tab('Automations')).toExist()
        await expect(TabsComponent.tab('Proxy')).toExist()
        await expect(TabsComponent.tab('Resources')).toExist()
        await expect(TabsComponent.tab('Secrets')).toExist()
        await expect(TabsComponent.tab('Terminal')).toExist()
      })

      it("Should be able to see the 'deploy' button in 'Publish Images' section", async () => {
        const $publishedImagesSection = $(`[data-testid="published-images"]`)
        await expect($publishedImagesSection).toExist()

        const $deployButton = await LinkComponent.link(
          `deploy-button-${artifactVersion}`,
          'Deploy'
        )
        await expect($deployButton).toExist()

        $deployButton.click()
      })

      it('Should be redirected to the deploy journey', async () => {
        await expect(browser).toHaveTitle(
          'Deploy service details | Core Delivery Platform - Portal'
        )
        await expect(await DeployPage.navIsActive()).toBe(true)

        await expect(
          await PageHeadingComponent.caption('Deploy service')
        ).toExist()
        await expect(await PageHeadingComponent.title('Details')).toExist()

        const $pageHeadingIntro = PageHeadingComponent.intro()
        await expect($pageHeadingIntro).toExist()
        await expect($pageHeadingIntro).toHaveHTML(
          expect.stringContaining(
            'Provide the microservice image name, version and environment to deploy to'
          )
        )
        await expect(FormComponent.input('image-name')).toHaveValue(
          testRepositoryName
        )
        await expect(FormComponent.input('version')).toHaveValue(
          artifactVersion
        )
      })
    })
  })
})

describe('Postgres service page', () => {
  const dbApplyChangelogEnv = 'dev'
  const postgresArtifactVersion = '0.100.0'

  describe('Logged in as "admin" with "restrictedTechPostgres" permission', () => {
    before(async () => {
      const permissionName = 'restrictedTechPostgres'

      await LoginStubPage.loginAsAdmin()
      await createPermission(permissionName, 'Team')
      await addPermissionToTeam(permissionName, 'Platform')
    })

    after(async () => {
      await LoginStubPage.loginAsAdmin()
      await deletePermission('restrictedTechPostgres')
    })

    it("Should be on the 'Services' list page", async () => {
      await ServicesPage.open()

      await expect(browser).toHaveTitle(
        'Services | Core Delivery Platform - Portal'
      )

      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title('Services')).toExist()
    })

    it("Should be able to search for a service on the 'Service' page", async () => {
      await ServicesPage.serviceSearchBox().click()
      await browser.keys(postgresService)

      const postgresServiceLink = await LinkComponent.link(
        'app-link',
        postgresService
      )
      await postgresServiceLink.waitForExist({ timeout: 5000 })
    })

    it("Should be able to navigate to a 'Service' page via the list", async () => {
      await LinkComponent.link('app-link', postgresService).click()

      await expect(browser).toHaveTitle(
        `${postgresService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.title(postgresService)).toExist()
      await expect(await PageHeadingComponent.caption('Service')).toExist()
    })

    it("Should be able to see the expected admin tabs on 'Service' page", async () => {
      await expect(TabsComponent.activeTab()).toHaveText('About')
      await ServicesPage.hasOwnerTabs()
    })

    it("Should be able to see the 'deploy' button in 'Publish Images' section", async () => {
      const $publishedImagesSection = $(`[data-testid="published-images"]`)
      await expect($publishedImagesSection).toExist()

      const $deployButton = await LinkComponent.link(
        `deploy-button-${postgresArtifactVersion}`,
        'Deploy'
      )
      await expect($deployButton).toExist()
    })

    it("Should be able to see the 'update' button in 'Database Changes' section", async () => {
      const $databaseChangesSection = $(`[data-testid="database-changes"]`)
      await expect($databaseChangesSection).toExist()

      const $applyButton = await LinkComponent.link(
        `apply-button-${postgresServiceVersion}`,
        'Apply'
      )
      await expect($applyButton).toExist()
      await $applyButton.click()
    })

    it("Should be redirected to the 'Apply Changelog' journey with prefilled form values", async () => {
      await expect(browser).toHaveTitle(
        'Apply changelog details | Core Delivery Platform - Portal'
      )
      await expect(await ApplyChangelog.navIsActive()).toBe(true)
      await expect(
        await PageHeadingComponent.caption('Apply changelog')
      ).toExist()
      await expect(await PageHeadingComponent.title('Details')).toExist()

      const $pageHeadingIntro = PageHeadingComponent.intro()
      await expect($pageHeadingIntro).toExist()
      await expect($pageHeadingIntro).toHaveHTML(
        expect.stringContaining(
          'Provide the microservice name, database changelog version and environment you wish to apply your database changes to'
        )
      )
      await expect(FormComponent.input('service-name')).toHaveValue(
        postgresService
      )
      await expect(FormComponent.input('version')).toHaveValue(
        postgresServiceVersion
      )
    })

    it('Should be able to complete the details form', async () => {
      await FormComponent.inputLabel('Environment').click()
      await browser.keys(dbApplyChangelogEnv)

      await FormComponent.submitButton('Next').click()
    })

    it("Should be on the 'Apply Changelog' summary page", async () => {
      await expect(browser).toHaveTitle(
        'Apply changelog summary | Core Delivery Platform - Portal'
      )
      await expect(await ApplyChangelog.navIsActive()).toBe(true)
      await expect(
        await PageHeadingComponent.caption('Apply changelog')
      ).toExist()
      await expect(await PageHeadingComponent.title('Summary')).toExist()
      await expect(
        PageHeadingComponent.intro(
          'Information about the database changelog update you are about to run'
        )
      ).toExist()
    })

    it("'Apply changelog' summary page should contain expected details", async () => {
      const summary = await ApplyChangelog.summary()

      await expect(summary).toHaveHTML(expect.stringContaining(postgresService))
      await expect(summary).toHaveHTML(
        expect.stringContaining(postgresServiceVersion)
      )
      await expect(summary).toHaveHTML(
        expect.stringContaining(dbApplyChangelogEnv)
      )

      await FormComponent.submitButton('Apply').click()
    })

    it('Should be redirected to the "Database update" deployment page', async () => {
      await expect(browser).toHaveTitle(
        `${postgresService} ${postgresServiceVersion} database update - Dev | Core Delivery Platform - Portal`
      )
      await expect(await DeploymentsPage.navIsActive()).toBe(true)
      await expect(
        await PageHeadingComponent.caption('Database update')
      ).toExist()
      await expect(await PageHeadingComponent.title(postgresService)).toExist()
      await expect(
        PageHeadingComponent.intro(
          `Database update for ${postgresService}, changelog version ${postgresServiceVersion} in ${dbApplyChangelogEnv}`
        )
      ).toExist()

      const $summaryList = await GovukSummaryListComponent.content()

      await expect($summaryList).toHaveHTML(
        expect.stringContaining(postgresService)
      )
      await expect($summaryList).toHaveHTML(
        expect.stringContaining(dbApplyChangelogEnv)
      )
      await expect($summaryList).toHaveHTML(
        expect.stringContaining(postgresServiceVersion)
      )
      await expect($summaryList).toHaveHTML(expect.stringContaining('Update'))
      await expect($summaryList).toHaveHTML(
        expect.stringContaining(
          `https://metrics.${dbApplyChangelogEnv}.cdp-int.defra.cloud`
        )
      )

      await $(`[data-testid="succeeded-status-tag"]*=Succeeded`).waitForExist()

      const updatedSummaryList =
        await GovukSummaryListComponent.content().getHTML()

      await expect(
        updatedSummaryList.includes(
          `https://logs.${dbApplyChangelogEnv}.cdp-int.defra.cloud`
        )
      ).toBe(true)
    })

    it('Should be redirected to the Service page', async () => {
      await LinkComponent.link('app-link', postgresService).click()

      await expect(browser).toHaveTitle(
        `${postgresService} microservice | Core Delivery Platform - Portal`
      )
      await expect(await ServicesPage.navIsActive()).toBe(true)
      await expect(await PageHeadingComponent.caption('Service')).toExist()
      await expect(await PageHeadingComponent.title(postgresService)).toExist()
    })

    it('Should see the update database change', async () => {
      const $databaseDetailsSection = await $(
        `[data-testid="database-details"]`
      )
      await expect($databaseDetailsSection).toHaveHTML(
        expect.stringContaining(postgresServiceVersion)
      )
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
        await expect(await PageHeadingComponent.title('Services')).toExist()

        await LinkComponent.link('app-link', postgresService).click()

        await expect(browser).toHaveTitle(
          `${postgresService} microservice | Core Delivery Platform - Portal`
        )
        await expect(await ServicesPage.navIsActive()).toBe(true)
        await expect(await PageHeadingComponent.caption('Service')).toExist()
        await expect(
          await PageHeadingComponent.title(postgresService)
        ).toExist()
      })

      it("Should not be able to see the 'apply' button in 'Database Changes' section", async () => {
        const $databaseChangesSection = $(`[data-testid="database-changes"]`)
        await expect($databaseChangesSection).toExist()

        const $applyButton = await LinkComponent.link(
          `apply-button-${postgresServiceVersion}`,
          'Apply'
        )
        await expect($applyButton).not.toExist()
      })
    })
  })
})
