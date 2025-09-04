import { browser, expect } from '@wdio/globals'

import { createUser, deleteUser } from 'helpers/create-user'
import BannerComponent from 'components/banner.component'
import FormComponent from 'components/form.component'
import LinkComponent from 'components/link.component'
import LoginStubPage from 'page-objects/login-stub.page'
import TeamPage from 'page-objects/team.page'
import PageHeadingComponent from 'components/page-heading.component'

const mockUserName = 'A Stub'

async function searchAndSelectACdpUser() {
  await FormComponent.inputLabel('CDP users name or email').click()
  await browser.keys('test')

  const aadUserSearchResult = FormComponent.inputLabel(
    'A Stub - a.stub@test.co'
  )
  await expect(aadUserSearchResult).toExist()
  await aadUserSearchResult.click()

  await FormComponent.submitButton('Add').click()
}

describe('Users', () => {
  describe('When logged in as non-admin', () => {
    before(async () => {
      await createUser('test')
      await LoginStubPage.loginAsNonAdmin()
    })

    describe('When adding and removing a user from a team they are a member of', () => {
      it('Should be able to go to the Teams page', async () => {
        await LinkComponent.link('nav-teams', 'Teams').click()
        await expect(browser).toHaveTitle(
          'Teams | Core Delivery Platform - Portal'
        )
        await expect(await PageHeadingComponent.title('Teams')).toExist()
      })

      it('Should be able to go to the TenantTeam1 page and see the buttons', async () => {
        await LinkComponent.link('app-entity-link', 'TenantTeam1').click()

        await expect(browser).toHaveTitle(
          'TenantTeam1 Team | Core Delivery Platform - Portal'
        )
        await expect(await PageHeadingComponent.caption('Team')).toExist()
        await expect(await PageHeadingComponent.title('TenantTeam1')).toExist()

        await expect(
          LinkComponent.link('add-team-member', 'Add member to team')
        ).toExist()
        await expect(LinkComponent.link('edit-link', 'Edit')).toExist()
      })

      it('Should be able to add a user to the team', async () => {
        await LinkComponent.link(
          'add-team-member',
          'Add member to team'
        ).click()

        await expect(browser).toHaveTitle(
          'Add Team Member | Core Delivery Platform - Portal'
        )
        await expect(await TeamPage.navIsActive()).toBe(true)
        await expect(await PageHeadingComponent.title('TenantTeam1')).toExist()
        await expect(
          PageHeadingComponent.caption('Add Member to Team')
        ).toExist()

        await searchAndSelectACdpUser()
      })

      it('Should be able to see the added user', async () => {
        await expect(browser).toHaveTitle(
          'TenantTeam1 Team | Core Delivery Platform - Portal'
        )
        await expect(await TeamPage.navIsActive()).toBe(true)

        await expect(TeamPage.memberDetails()).toHaveText(
          new RegExp(mockUserName, 'g')
        )
      })

      it('Should be able to remove the user from the team', async () => {
        await expect(TeamPage.memberDetails()).toHaveText(
          new RegExp(mockUserName, 'g')
        )
        await TeamPage.removeButton(mockUserName).click()
      })

      it('Should be on the confirm remove member page', async () => {
        await expect(browser).toHaveTitle(
          'Remove Team Member | Core Delivery Platform - Portal'
        )
        await expect(await TeamPage.navIsActive()).toBe(true)
        await expect(
          PageHeadingComponent.caption('Remove Member from Team')
        ).toExist()
        await expect(await PageHeadingComponent.title('TenantTeam1')).toExist()

        await FormComponent.submitButton('Remove team member').click()
      })

      it('Member should have been removed', async () => {
        await expect(browser).toHaveTitle(
          'TenantTeam1 Team | Core Delivery Platform - Portal'
        )
        await expect(await TeamPage.navIsActive()).toBe(true)

        await expect(
          BannerComponent.content('Member removed from team')
        ).toExist()

        await expect(TeamPage.memberDetails()).not.toHaveText(
          new RegExp(mockUserName, 'g')
        )
      })
    })

    describe('When viewing a team they are NOT a member of', () => {
      it('Should be able to go to the Teams page', async () => {
        await LinkComponent.link('nav-teams', 'Teams').click()
        await expect(browser).toHaveTitle(
          'Teams | Core Delivery Platform - Portal'
        )
        await expect(await PageHeadingComponent.title('Teams')).toExist()
      })

      it('Should be able to go to the Platform page but NOT see the buttons', async () => {
        await LinkComponent.link('app-entity-link', 'Platform').click()

        await expect(browser).toHaveTitle(
          'Platform Team | Core Delivery Platform - Portal'
        )
        await expect(await PageHeadingComponent.caption('Team')).toExist()
        await expect(await PageHeadingComponent.title('Platform')).toExist()

        await expect(
          LinkComponent.link('add-team-member', 'Add member to team')
        ).not.toExist()
        await expect(LinkComponent.link('edit-link', 'Edit')).not.toExist()
      })
    })

    after(async () => {
      await LoginStubPage.logOut()
      await deleteUser('A Stub')
    })
  })
})
