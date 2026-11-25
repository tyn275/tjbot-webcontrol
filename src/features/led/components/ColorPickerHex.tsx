import { useRef, type FC, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { isValidHex } from '../led.commands'
import { PaletteIcon } from './PaletteIcon'
import { PowerButtons } from './PowerButtons'

interface Props {
  readonly hexColor: string
  readonly onHexChange: (val: string) => void
  readonly onTurnOn: () => void
  readonly onTurnOff: () => void
}

export const ColorPickerHex: FC<Props> = ({ hexColor, onHexChange, onTurnOn, onTurnOff }) => {
  const { t } = useTranslation()
  const pickerRef = useRef<HTMLInputElement>(null)
  const isValid = isValidHex(hexColor)
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => onHexChange(e.target.value)

  return (
    <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
      <div className="input-group input-group-sm led__hex-input flex-grow-2">
        <span className="input-group-text bg-dark text-white fw-bold">#</span>
        <input
          type="text"
          className={`form-control text-uppercase ${!isValid ? 'led__hex-field--invalid' : ''}`}
          value={hexColor.replace('#', '')}
          maxLength={6}
          title={!isValid ? t('led.invalidHex') : ''}
          onChange={handleInput}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          title={t('led.openPalette')}
          onClick={() => pickerRef.current?.click()}
        >
          <PaletteIcon />
        </button>
        <input
          ref={pickerRef}
          type="color"
          className="led__color-native"
          value={isValid ? hexColor : '#A020F0'}
          onChange={handleInput}
        />
      </div>
      <PowerButtons onTurnOn={onTurnOn} onTurnOff={onTurnOff} />
    </div>
  )
}
