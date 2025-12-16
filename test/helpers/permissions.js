import { browser, expect } from '@wdio/globals'

import { oneMinute } from 'helpers/timeout.js'
import FormComponent from 'components/form.component'
import AdminPage from 'page-objects/admin.page.js'
import SplitPaneComponent from 'components/split-pane.component.js'
import LinkComponent from 'components/link.component.js'
import PageHeadingComponent from 'components/page-heading.component.js'
import EntityTableComponent from 'components/entity-table.component.js'
import GovukTableComponent from 'components/govuk-table.component'

async function addPermissionToTeam(permissionName, teamName) {
  // Go to addPermissionToTeam
  await AdminPage.open()
  await SplitPaneComponent.subNavItem('permissions').click()
  await EntityTableComponent.entityLink(permissionName).click()

  // Add permission to team
  await LinkComponent.link('add-permission', 'Add permission to a').click()

  await FormComponent.inputLabel('Search for a').click()
  await browser.keys(teamName)
  await FormComponent.inputLabel(teamName).click()

  await FormComponent.submitButton('Add permission').click()

  await expect(await PageHeadingComponent.title(permissionName)).toExist()
  await expect(await PageHeadingComponent.caption('Permission')).toExist()
}

async function addPermissionToMember({ permissionName, memberName, teamName }) {
  // Go to addPermissionToTeam
  await AdminPage.open()
  await SplitPaneComponent.subNavItem('permissions').click()
  await EntityTableComponent.entityLink(permissionName).click()

  // Add permission to member
  await LinkComponent.link(
    'add-permission',
    'Add permission to team member'
  ).click()

  // Find CDP user
  await FormComponent.inputLabel('Find CDP user').click()
  await browser.keys(memberName)

  const memberNameResult = await FormComponent.inputLabel(memberName)
  await memberNameResult.waitForExist({ timeout: oneMinute })
  await memberNameResult.click()

  await FormComponent.submitButton('Next').click()

  // Scope to team
  await FormComponent.inputLabel(teamName).click()
  await FormComponent.submitButton('Next').click()

  // Add permission
  await FormComponent.submitButton('Add permission').click()

  // Should be redirected to permission page
  await expect(await PageHeadingComponent.title(permissionName)).toExist()
  await expect(await PageHeadingComponent.caption('Permission')).toExist()
}

async function removeMemberFromPermission({ permissionName, memberName }) {
  // Go to addPermissionToTeam
  await AdminPage.open()
  await SplitPaneComponent.subNavItem('permissions').click()
  await EntityTableComponent.entityLink(permissionName).click()

  // Remove member from permission
  await GovukTableComponent.linkInRow({
    testId: 'team-member-panel',
    rowContent: memberName,
    linkText: 'Remove'
  }).click()

  await FormComponent.submitButton('Remove permission').click()
}

export {
  addPermissionToTeam,
  addPermissionToMember,
  removeMemberFromPermission
}
