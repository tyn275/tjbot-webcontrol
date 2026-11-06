import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

// Hằng số URL trang tài liệu và trợ lý Toolhub của TJBot
const TOOLHUB_URL = 'https://toolhub.app/tjbot/'

// Trang hiển thị thông tin giới thiệu và tài liệu hướng dẫn TJBot
export const IntroPage: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="d-flex flex-column h-100 w-100 intro-page">
      <div className="card border-0 shadow-sm flex-grow-1 overflow-hidden intro-page__card">
        <iframe src={TOOLHUB_URL} title={t('introFrameTitle')} className="intro-page__frame" />
      </div>
    </div>
  )
}
