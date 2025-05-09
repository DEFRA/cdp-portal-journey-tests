import { browser, expect } from '@wdio/globals'

import FormComponent from 'components/form.component'
import LoginStubPage from 'page-objects/login-stub.page.js'
import AdminPage from 'page-objects/admin.page.js'
import SplitPaneComponent from 'components/split-pane.component.js'
import LinkComponent from 'components/link.component.js'
import PageHeadingComponent from 'components/page-heading.component.js'

async function addPermission(permissionName, teamName) {
  await LoginStubPage.loginAsAdmin()

  // Go to permissions create form
  await AdminPage.open()
  await SplitPaneComponent.subNavItem('permissions').click()
  await LinkComponent.link(
    'app-page-heading-cta',
    'Create new permission'
  ).click()

  // Fill out form
  await FormComponent.inputLabel('Value').click()
  await browser.keys(permissionName)

  await FormComponent.inputLabel('Team').click()

  await FormComponent.inputLabel('Description').click()
  await browser.keys('Postgres permission')

  await FormComponent.submitButton('Create').click()

  // Add permission to team
  await LinkComponent.link('add-permission', 'Add permission to a team').click()

  await FormComponent.inputLabel('Search for a Team').click()
  await browser.keys(teamName)
  await FormComponent.inputLabel(teamName).click()

  await FormComponent.submitButton('Add permission').click()

  await expect(await PageHeadingComponent.title(permissionName)).toExist()
  await expect(await PageHeadingComponent.caption('Permission')).toExist()
}

async function deletePermission(permissionName) {
  await LoginStubPage.loginAsAdmin()

  // Go to permission page
  await AdminPage.open()
  await SplitPaneComponent.subNavItem('permissions').click()
  await LinkComponent.link('app-entity-link', permissionName).click()

  // Go to delete permission page
  await LinkComponent.link('delete-permission', 'Delete permission').click()
}

export { addPermission, deletePermission }
