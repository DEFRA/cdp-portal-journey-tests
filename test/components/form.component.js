import { $ } from '@wdio/globals'

/**
 * Form helper component
 */
class FormComponent {
  form() {
    return $('form')
  }

  legend(content) {
    return $('legend*=' + content)
  }

  inputLabel(content) {
    return $('label*=' + content)
  }

  input(id) {
    return $(`#${id}`)
  }

  inputByValue(value) {
    return $(`input[value="${value}"]`)
  }

  submitButton(content) {
    return $('button*=' + content)
  }
}

export default new FormComponent()
