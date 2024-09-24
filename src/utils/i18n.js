import { createI18n } from 'vue-i18n'
import locale from '@opentiny/vue-locale'

export default (i18n) =>
  locale.initI18n({
    i18n,
    createI18n,
    messages: {
      enUS: {
        test: 'English'
      }
    }
  })
