import FormComponent from 'components/form.component.js'
import LinkComponent from 'components/link.component.js'
import ServicesMaintenancePage from 'page-objects/services-maintenance.page.js'
import { oneMinute } from 'helpers/timeout.js'

const unshutterService = async (serviceName, shutterId) => {
  await ServicesMaintenancePage.open(serviceName)

  await expect(ServicesMaintenancePage.shutteringPanel()).toExist()

  const shutterStatus = await $(`[data-testid="shuttered-status-${shutterId}"]`)

  const status = await shutterStatus.getText()
  if (status === 'Shuttered') {
    const $unshutterLink = await LinkComponent.link(
      `shutter-link-${shutterId}`,
      'Unshutter'
    )
    await $($unshutterLink).click()
    await FormComponent.submitButton('Unshutter url').click()

    await $(
      `[data-testid="shuttered-status-${shutterId}"]*=Active`
    ).waitForExist({
      timeout: oneMinute // Wait for the shuttered status to change in stubs
    })
  }
}

export { unshutterService }
