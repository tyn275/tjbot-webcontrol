import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { GymPlaceholderCard } from './components/GymPlaceholderCard'

// Trang phòng tập điều khiển các phân hệ phần cứng
export const GymPage: FC = () => {
  const { t } = useTranslation()
  const notice = t('placeholderNotice')

  return (
    <div className="gym-layout container-fluid p-1">
      <div className="row g-4">
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardLed')} notice={notice} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardArm')} notice={notice} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardAudio')} notice={notice} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardMic')} notice={notice} />
        </div>
        <div className="col-md-6">
          <GymPlaceholderCard title={t('cardCamera')} notice={notice} />
        </div>
      </div>
    </div>
  )
}
