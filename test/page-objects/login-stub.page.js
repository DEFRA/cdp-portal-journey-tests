import { Page } from 'page-objects/page'
import { $, browser, expect } from '@wdio/globals'

class LoginStubPage extends Page {
  adminUserLink() {
    return $('a[id="admin"]*=' + 'Admin User')
  }

  nonAdminUserLink() {
    return $('a[id="nonAdmin"]*=' + 'Non-Admin User')
  }

  async loginAsAdmin() {
    await super.login()
    await expect(browser).toHaveTitle('CDP-Portal-Stubs - Login Stub')

    const adminUserLink = this.adminUserLink()
    await expect(adminUserLink).toExist()

    await adminUserLink.click()
  }

  async loginAsNonAdmin() {
    await super.login()
    await expect(browser).toHaveTitle('CDP-Portal-Stubs - Login Stub')

    const nonAdminUserLink = this.nonAdminUserLink()
    await expect(nonAdminUserLink).toExist()

    await nonAdminUserLink.click()
  }

  logout() {
    return super.logOut()
  }
}

export default new LoginStubPage()
