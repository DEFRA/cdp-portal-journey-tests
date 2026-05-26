import { browser, expect } from '@wdio/globals'
import ServicePage from 'page-objects/services.page'
import TeamsPage from 'page-objects/teams.page'

import HomePage from 'page-objects/home.page'
describe('Home page', () => {
  beforeEach(async () => {
    await browser.deleteCookies()
  })

  it('Should be on the "Home" page', async () => {
    await HomePage.open()

    await expect(browser).toHaveTitle('Home | Core Delivery Platform - Portal')
    await expect(await HomePage.navIsActive()).toBe(true)
    await expect(HomePage.serviceName).toHaveText(
      'Core Delivery Platform - Portal'
    )
    await expect(HomePage.pageHeading()).toHaveText(
      'Build your Defra applications on the Core Delivery Platform'
    )
  })
})

describe('Services page', () => {
  it('Should be on the "Services" page', async () => {
    await ServicePage.open()

    await expect(browser).toHaveTitle(
      'Services | Core Delivery Platform - Portal'
    )
    await expect(await ServicePage.navIsActive()).toBe(true)
    await expect(ServicePage.serviceName).toHaveText(
      'Core Delivery Platform - Portal'
    )
    await expect(ServicePage.title).toHaveText('Services')
  })
})

describe('Teams page', () => {
  it('Should be on the "Teams" page', async () => {
    await TeamsPage.open()

    await expect(browser).toHaveTitle('Teams | Core Delivery Platform - Portal')
    await expect(await TeamsPage.navIsActive()).toBe(true)
    await expect(TeamsPage.serviceName).toHaveText(
      'Core Delivery Platform - Portal'
    )
    await expect(TeamsPage.title).toHaveText('Teams')
  })
})
