import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { commonI18n } from './common.i18n'
import { ledTranslations } from '../features/led/led.i18n'

export const defaultNS = 'common'

export const resources = {
  vi: {
    common: {
      ...commonI18n.vi,
      led: ledTranslations.vi,
    },
  },
  en: {
    common: {
      ...commonI18n.en,
      led: ledTranslations.en,
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
