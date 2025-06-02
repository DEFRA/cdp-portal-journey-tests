import { $ } from '@wdio/globals'

/** appEntityTable component */
class EntityTableComponent {
  content(content) {
    return $('[data-testid="app-entity-table"]*=' + content)
  }

  entityLink(content) {
    return $('[data-testid="app-entity-link"]*=' + content)
  }

  row(content) {
    return $('[class="app-entity-table__row"]*=' + content)
  }
}

export default new EntityTableComponent()
