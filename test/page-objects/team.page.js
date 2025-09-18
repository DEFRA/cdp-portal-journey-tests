import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class TeamPage extends Page {
  navIsActive() {
    return super.navIsActive('teams')
  }

  teamDetails() {
    return $('[data-testid="team-details"]')
  }

  memberDetails() {
    return $('[data-testid="user-details"]')
  }

  removeButton(name) {
    const rowItem = $$('[data-testid="user-details"] .govuk-table__row').find(
      async (row) => {
        const textContent = await row.getText()

        return textContent.includes(name)
      }
    )

    return rowItem.$('a[data-testid="remove-user"]')
  }

  open(value) {
    return super.open('/teams/' + value)
  }
}

export default new TeamPage()
