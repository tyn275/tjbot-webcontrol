import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onTrigger: (effect: string) => void
}

const RainbowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="me-1">
    <path d="M256 96c141.4 0 256 114.6 256 256 0 17.7-14.3 32-32 32s-32-14.3-32-32c0-106-86-192-192-192S64 246 64 352c0 17.7-14.3 32-32 32s-32-14.3-32-32C0 210.6 114.6 96 256 96zm0 96c88.4 0 160 71.6 160 160 0 17.7-14.3 32-32 32s-32-14.3-32-32c0-53-43-96-96-96s-96 43-96 96c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-88.4 71.6-160 160-160zm0 96c35.3 0 64 28.7 64 64 0 17.7-14.3 32-32 32s-32-14.3-32-32c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-35.3 28.7-64 64-64z" />
  </svg>
)

const WindIcon = () => (
  <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" className="me-1">
    <path d="M288 32c0 17.7-14.3 32-32 32H32C14.3 64 0 49.7 0 32S14.3 0 32 0h224c17.7 0 32 14.3 32 32zm96 128H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h352c53 0 96 43 96 96s-43 96-96 96-96-43-96-96c0-17.7 14.3-32 32-32s32 14.3 32 32c0 17.7 14.3 32 32 32s32-14.3 32-32-14.3-32-32-32zM32 256c-17.7 0-32-14.3-32-32s14.3-32 32-32h160c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zm256 64H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h256c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
  </svg>
)

const OmbreRow: FC<{ onTrigger: (e: string) => void }> = ({ onTrigger }) => {
  const { t } = useTranslation()
  return (
    <div className="d-flex gap-2 align-items-center mb-2">
      <button
        type="button"
        className="btn btn-sm led__btn-ombre led__btn-ombre--rg"
        onClick={() => onTrigger('RG')}
      >
        <span className="led__text-red">{t('led.colorRed')}</span>
        <span className="led__dash led__dash--rg">-</span>
        <span className="led__text-green">{t('led.colorGreen')}</span>
      </button>
      <button
        type="button"
        className="btn btn-sm led__btn-ombre led__btn-ombre--rw"
        onClick={() => onTrigger('RW')}
      >
        <span className="led__text-red">{t('led.colorRed')}</span>
        <span className="led__dash led__dash--rw">-</span>
        <span className="led__text-pearl">{t('led.colorWhite')}</span>
      </button>
      <button
        type="button"
        className="btn btn-sm led__btn-ombre led__btn-ombre--gw"
        onClick={() => onTrigger('GW')}
      >
        <span className="led__text-green">{t('led.colorGreen')}</span>
        <span className="led__dash led__dash--gw">-</span>
        <span className="led__text-pearl">{t('led.colorWhite')}</span>
      </button>
    </div>
  )
}

export const RainbowButtons: FC<Props> = ({ onTrigger }) => {
  const { t } = useTranslation()

  return (
    <>
      <OmbreRow onTrigger={onTrigger} />
      <div className="d-flex gap-2 align-items-center">
        <button
          type="button"
          className="btn btn-sm led__btn-7color"
          onClick={() => onTrigger('7Color')}
        >
          <RainbowIcon />
          {t('led.effectSevenColor')}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-info led__btn-breath"
          onClick={() => onTrigger('Breath')}
        >
          <WindIcon />
          {t('led.effectBreath')}
        </button>
      </div>
    </>
  )
}
