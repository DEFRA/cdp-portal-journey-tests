import { expect } from '@wdio/globals'
import ServicesMaintenancePage from 'page-objects/services-maintenance.page.js'
import PageHeadingComponent from 'components/page-heading.component.js'
import TabsComponent from 'components/tabs.component.js'
import ServicesPage from 'page-objects/services.page.js'

export const ownerCanViewTab = async (caption, title, activeTab) => {
  await expect(await ServicesMaintenancePage.navIsActive()).toBe(true)
  await expect(await PageHeadingComponent.caption(caption)).toExist()
  await expect(await PageHeadingComponent.title(title)).toExist()

  await expect(TabsComponent.activeTab()).toHaveText(activeTab)
  await ServicesPage.hasOwnerTabs()
}
