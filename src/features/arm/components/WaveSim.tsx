import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

// Khối đĩa tròn mô phỏng hoạt ảnh vẫy tay của robot
export const WaveSim: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="text-center border-end pe-4 me-2 arm-wave-sim">
      <div className="p-2 rounded d-flex flex-column align-items-center justify-content-center border arm-wave-sim__box">
        <div className="arm-wave-sim__disk">
          <i className="fa-solid fa-hand arm-wave-sim__icon" />
        </div>
        <div className="mt-2 fw-bold text-muted small">{t('arm.waveScenario')}</div>
      </div>
    </div>
  )
}
