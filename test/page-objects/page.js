import { browser, $ } from '@wdio/globals'

class Page {
  pageHeading() {
    return $('h1')
  }

  navItem(navItemName) {
    return $(`[data-testid="nav-${navItemName}"]`).parentElement()
  }

  /**
   * Check if a navigation items li parent has the active class
   * @param navItemName
   * @returns {Promise<boolean>}
   */
  async navIsActive(navItemName) {
    const navItem = await this.navItem(navItemName)
    const className = await navItem.getAttribute('class')

    return className.includes('govuk-service-navigation__item--active')
  }

  logInLink(value = 'Sign in') {
    return $('[data-testid="app-login-link"]*=' + value)
  }

  logOutLink(value = 'Sign out') {
    return $('[data-testid="app-login-link"]*=' + value)
  }

  async login() {
    await this.open('/logout')
    await this.open('/')
    await this.logInLink().click()
  }

  async logOut() {
    await this.open('/')
    await this.logOutLink().click()
  }

  open(path) {
    return browser.url(path)
  }

  link(value) {
    return $('a*=' + value)
  }
}

export { Page }
