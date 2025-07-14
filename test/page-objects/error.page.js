import { Page } from 'page-objects/page'
import PageHeadingComponent from 'components/page-heading.component.js'

class ErrorPage extends Page {
  title(content) {
    return PageHeadingComponent.title(content)
  }

  message() {
    return PageHeadingComponent.intro()
  }
}

export default new ErrorPage()
