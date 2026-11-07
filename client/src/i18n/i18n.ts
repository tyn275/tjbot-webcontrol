import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { commonI18n } from './common.i18n'

export const defaultNS = 'common'

export const resources = {
  vi: {
    common: commonI18n.vi,
  },
  en: {
    common: commonI18n.en,
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
