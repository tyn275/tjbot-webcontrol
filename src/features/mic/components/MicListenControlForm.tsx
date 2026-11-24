import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MicLanguageSelect } from './MicLanguageSelect'
import { MicListenButtons } from './MicListenButtons'
import { MicS2tTextarea } from './MicS2tTextarea'
import type { useMicListen } from '../hooks/useMicListen'

interface Props {
  readonly listen: ReturnType<typeof useMicListen>
}

// Khung form nhập cấu hình và hiển thị kết quả lắng nghe AI
export const MicListenControlForm: FC<Props> = ({ listen }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-light p-2 rounded border d-flex flex-column gap-2">
      <MicS2tTextarea value={listen.s2tOutput} />
      <div className="d-flex gap-2 align-items-end">
        <div className="flex-grow-1">
          <label className="text-muted small fw-bold d-block mb-1">{t('mic.language')}</label>
          <MicLanguageSelect lang={listen.lang} onLangChange={listen.setLang} />
        </div>
        <div className="mic__side-box">
          <label className="text-muted small fw-bold d-block mb-1 text-nowrap">
            {t('mic.timeSeconds')}
          </label>
          <input
            type="number"
            className="form-control form-control-sm text-center"
            value={listen.timeout}
            min="2"
            max="20"
            onChange={(e) => listen.setTimeoutVal(Number(e.target.value))}
          />
        </div>
      </div>
      <MicListenButtons onStart={listen.startListen} onStop={listen.stopListen} />
    </div>
  )
}
