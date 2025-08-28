import { browser, expect } from '@wdio/globals'

import FormComponent from 'components/form.component'
import LoginStubPage from 'page-objects/login-stub.page.js'
import AdminPage from 'page-objects/admin.page.js'
import SplitPaneComponent from 'components/split-pane.component.js'
import LinkComponent from 'components/link.component.js'
import PageHeadingComponent from 'components/page-heading.component.js'

async function createPermission(permissionName, applicableTo = 'Team') {
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

  await FormComponent.inputLabel(applicableTo).click()

  await FormComponent.inputLabel('Description').click()
  await browser.keys(permissionName + ' permission')

  await FormComponent.submitButton('Create').click()
}

async function addPermission(permissionName, teamName) {
  await createPermission(permissionName)

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

  await AdminPage.open()
  await SplitPaneComponent.subNavItem('permissions').click()
  await LinkComponent.link('app-entity-link', permissionName).click()

  await expect(PageHeadingComponent.title(permissionName)).toExist()
  await LinkComponent.link('delete-permission', 'Delete permission').click()

  await expect(PageHeadingComponent.title(permissionName)).toExist()
  await expect(PageHeadingComponent.caption('Delete Permission')).toExist()
  await FormComponent.submitButton('Delete permission').click()

  await expect(PageHeadingComponent.title('Permissions')).toExist()
  await expect(
    LinkComponent.link('app-entity-link', permissionName)
  ).not.toExist()
}

export { addPermission, createPermission, deletePermission }
