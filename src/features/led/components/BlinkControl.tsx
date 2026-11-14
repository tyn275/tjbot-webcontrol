import type { FC, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { BlinkSpeedSelect } from './BlinkSpeedSelect'

interface Props {
  readonly blinkTimes: number
  readonly blinkSpeed: 'fast' | 'slow'
  readonly colorName: string
  readonly onTimesChange: (times: number) => void
  readonly onSpeedChange: (speed: 'fast' | 'slow') => void
  readonly onBlink: () => void
}

export const BlinkControl: FC<Props> = (props) => {
  const { t } = useTranslation()
  const handleTimes = (e: ChangeEvent<HTMLInputElement>) =>
    props.onTimesChange(Number(e.target.value) || 1)

  return (
    <>
      <div className="led__blink-box d-flex gap-2 align-items-center p-2 bg-light rounded border flex-wrap">
        <div className="d-flex align-items-center gap-1">
          <span className="small text-muted fw-bold text-nowrap">{t('led.blinkTimes')}</span>
          <input
            type="number"
            className="form-control form-control-sm text-center led__blink-input"
            value={props.blinkTimes}
            min={1}
            max={20}
            onChange={handleTimes}
          />
        </div>
        <BlinkSpeedSelect speed={props.blinkSpeed} onChange={props.onSpeedChange} />
        <button
          className="btn btn-warning btn-sm fw-bold px-3 flex-grow-1 text-nowrap"
          type="button"
          onClick={props.onBlink}
        >
          <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor" className="me-1">
            <path d="M0 256L224 0 176 208h192L160 512 208 304H0z" />
          </svg>
          {t('led.btnBlink')}
        </button>
      </div>
      <div className="led__recognized-text text-muted mt-1">
        {t('led.recognizedAs')} <span className="led__color-name fw-bold">{props.colorName}</span>
      </div>
    </>
  )
}
