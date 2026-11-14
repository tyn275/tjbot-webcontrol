import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  readonly onWave: () => void
  readonly onStop: () => void
}

// Cụm nút bấm kích hoạt vẫy tay và dừng khẩn cấp
export const WaveButtons: FC<Props> = ({ onWave, onStop }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="arm-wave__btn-wave">
        <button
          type="button"
          className="btn btn-warning btn-sm fw-bold w-100 text-white arm-wave__btn"
          onClick={onWave}
        >
          {t('arm.waveHand')}
        </button>
      </div>
      <div className="arm-wave__btn-stop">
        <button
          type="button"
          className="btn btn-danger btn-sm fw-bold w-100 arm-wave__btn"
          onClick={onStop}
        >
          {t('arm.stop')}
        </button>
      </div>
    </>
  )
}
