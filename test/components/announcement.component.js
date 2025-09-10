import { $ } from '@wdio/globals'

/** appAnnouncement component */
class AnnouncementComponent {
  link(content) {
    return $('[data-testid="app-announcement-content"]').$(
      `a[data-testid="app-link"].*=${content}`
    )
  }

  content() {
    return $('[data-testid="app-announcement-content"]')
  }
}

export default new AnnouncementComponent()
