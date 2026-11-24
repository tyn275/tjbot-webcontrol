import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { commonI18n } from './common.i18n'
import { ledTranslations } from '../features/led/led.i18n'
import { armTranslations } from '../features/arm/arm.i18n'
import { audioTranslations } from '../features/audio/audio.i18n'
import { micTranslations } from '../features/mic/mic.i18n'

export const defaultNS = 'common'

export const resources = {
  vi: {
    common: {
      ...commonI18n.vi,
      led: ledTranslations.vi,
      arm: armTranslations.vi,
      audio: audioTranslations.vi,
      mic: micTranslations.vi.mic,
    },
  },
  en: {
    common: {
      ...commonI18n.en,
      led: ledTranslations.en,
      arm: armTranslations.en,
      audio: audioTranslations.en,
      mic: micTranslations.en.mic,
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
