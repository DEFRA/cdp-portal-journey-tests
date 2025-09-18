import { $, browser, expect } from '@wdio/globals'

import AnnouncementComponent from 'components/announcement.component'
import BannerComponent from 'components/banner.component'
import FormComponent from 'components/form.component'
import GovukTableComponent from 'components/govuk-table.component'
import LinkComponent from 'components/link.component'
import LoginStubPage from 'page-objects/login-stub.page'
import TeamPage from 'page-objects/team.page'
import PageHeadingComponent from 'components/page-heading.component'
import ServicesPage from 'page-objects/services.page.js'
import TabsComponent from 'components/tabs.component.js'
import {
  addPermissionToMember,
  removeMemberFromPermission
} from 'helpers/permissions.js'

const goToServiceTerminalPage = async ({ tenantService }) => {
  await ServicesPage.open()
  await expect(browser).toHaveTitle(
    'Services | Core Delivery Platform - Portal'
  )
  await expect(await ServicesPage.navIsActive()).toBe(true)
  await expect(await PageHeadingComponent.title('Services')).toExist()

  await LinkComponent.link('app-link', tenantService).click()

  await expect(browser).toHaveTitle(
    `${tenantService} microservice | Core Delivery Platform - Portal`
  )
  await expect(await ServicesPage.navIsActive()).toBe(true)
  await expect(await PageHeadingComponent.title(tenantService)).toExist()
  await expect(await PageHeadingComponent.caption('Service')).toExist()

  const terminalTab = await TabsComponent.tab('Terminal')
  await expect(terminalTab).toExist()
  await terminalTab.click()

  await expect(await PageHeadingComponent.caption('Terminal')).toExist()
  await expect(await PageHeadingComponent.title(tenantService)).toExist()
}

describe('Teams', () => {
  const nonAdminUser = 'Non-Admin User'
  const teamName = 'TenantTeam1'
  const permissionName = 'canGrantBreakGlass'
  const tenantService = 'tenant-backend'

  describe('When logged in as non-admin', () => {
    it('Should be able assign "canGrantBreakGlass" permission to user', async () => {
      await LoginStubPage.loginAsAdmin()
      await addPermissionToMember({
        permissionName,
        memberName: nonAdminUser,
        teamName
      })
    })

    describe('Should be able to see user in the tenant team', () => {
      before(async () => {
        await LoginStubPage.loginAsNonAdmin()
      })

      after(async () => {
        await LoginStubPage.logOut()
        await LoginStubPage.loginAsAdmin()
        await removeMemberFromPermission({
          permissionName,
          memberName: nonAdminUser
        })
      })

      it('Should show the member in the team page', async () => {
        await LinkComponent.link('nav-teams', 'Teams').click()
        await expect(browser).toHaveTitle(
          'Teams | Core Delivery Platform - Portal'
        )
        await expect(await PageHeadingComponent.title('Teams')).toExist()

        await LinkComponent.link('app-entity-link', teamName).click()
        await expect(browser).toHaveTitle(
          `${teamName} Team | Core Delivery Platform - Portal`
        )
        await expect(await PageHeadingComponent.caption('Team')).toExist()
        await expect(await PageHeadingComponent.title(teamName)).toExist()
        await expect(TeamPage.memberDetails()).toHaveText(
          new RegExp(nonAdminUser, 'gi')
        )
      })

      it('Should be able to see the "Grant break glass" link', async () => {
        await expect(TeamPage.memberDetails()).toHaveText(/Grant break glass/gi)
      })

      it('Should be able to grant "break glass" ', async () => {
        await GovukTableComponent.linkInRow({
          testId: 'user-details',
          rowContent: nonAdminUser,
          linkText: 'Grant break glass',
          dataTestId: 'grant-break-glass'
        }).click()
      })

      it('Should show the grant break glass page', async () => {
        await expect(browser).toHaveTitle(
          'Grant break glass | Core Delivery Platform - Portal'
        )
        await expect(
          await PageHeadingComponent.caption('Grant break glass to')
        ).toExist()
        await expect(await PageHeadingComponent.title(nonAdminUser)).toExist()
        await expect(PageHeadingComponent.intro()).toHaveText(
          `Grant break glass to ${nonAdminUser} in the ${teamName} team for the next 2 hours`
        )
      })

      it('Should be able to fill out the grant break glass form', async () => {
        await FormComponent.inputLabel('Reason').click()
        await browser.keys(
          'Because I would like to test the functionality of the break glass feature in journey tests'
        )
        await FormComponent.inputLabel('Yes').click()

        await $('[data-testid="i-agree-checkbox"]').waitForExist({
          timeout: 20000 // Wait for the agree checkbox to show itself
        })

        await FormComponent.inputLabel('I agree with the above').click()
        await FormComponent.submitButton('Grant access').click()
      })

      it('Should have the break glass announcement present', async () => {
        await expect(
          BannerComponent.content(
            `Break glass permission added for ${nonAdminUser}`
          )
        ).toExist()
        await expect(await AnnouncementComponent.content()).toHaveText(
          new RegExp(
            `You have active break glass for the ${teamName} team. From today`,
            'gi'
          )
        )
      })

      it('Should be able to view the "prod" terminal', async () => {
        await goToServiceTerminalPage({ tenantService })

        await expect(GovukTableComponent.content()).toHaveText(/Prod/gi)
      })

      it('Should be able to go to the users team page via the announcement banner', async () => {
        await AnnouncementComponent.link(teamName).click()

        await expect(browser).toHaveTitle(
          `${teamName} Team | Core Delivery Platform - Portal`
        )
        await expect(await PageHeadingComponent.caption('Team')).toExist()
        await expect(await PageHeadingComponent.title(teamName)).toExist()
        await expect(TeamPage.memberDetails()).toHaveText(
          new RegExp(nonAdminUser, 'gi')
        )
      })

      it('Should be able to remove "break glass"', async () => {
        await GovukTableComponent.linkInRow({
          testId: 'user-details',
          rowContent: nonAdminUser,
          linkText: 'Remove break glass',
          dataTestId: 'remove-break-glass'
        }).click()

        await expect(browser).toHaveTitle(
          'Remove break glass | Core Delivery Platform - Portal'
        )
        await expect(
          await PageHeadingComponent.caption('Remove break glass from')
        ).toExist()
        await expect(await PageHeadingComponent.title(nonAdminUser)).toExist()
        await expect(PageHeadingComponent.intro()).toHaveText(
          `Remove break glass from ${nonAdminUser} in the ${teamName} team`
        )

        await FormComponent.submitButton('Remove break glass').click()
      })

      it('Should have "break glass" removed', async () => {
        await expect(
          BannerComponent.content(
            `Break glass permission removed from ${nonAdminUser}`
          )
        ).toExist()

        await expect(await AnnouncementComponent.content()).not.toExist()

        await GovukTableComponent.linkInRow({
          testId: 'user-details',
          rowContent: nonAdminUser,
          linkText: 'Grant break glass'
        }).click()
      })

      it('Should not be able to view the "prod" terminal', async () => {
        await goToServiceTerminalPage({ tenantService })

        await expect(GovukTableComponent.content()).not.toHaveText(/Prod/gi)
      })
    })
  })
})
