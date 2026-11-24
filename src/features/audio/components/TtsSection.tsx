import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AudioDiskSim } from './AudioDiskSim'
import { TtsForm } from './TtsForm'
import { AudioCommandLog } from './AudioCommandLog'
import type { useAudioTts } from '../hooks/useAudioTts'

interface Props {
  readonly tts: ReturnType<typeof useAudioTts>
}

// Khối chức năng chuyển đổi văn bản thành giọng nói (Tập đọc - TTS)
export const TtsSection: FC<Props> = ({ tts }) => {
  const { t } = useTranslation()

  return (
    <div className="row g-3 align-items-center">
      <div className="col-auto">
        <AudioDiskSim variant="reading" active={tts.isReading} labelKey="audio.labelTapdoc" />
      </div>
      <div className="col audio__tts-col">
        <label className="form-label fw-semibold text-secondary small mb-1">
          {t('audio.sectionTts')}
        </label>
        <TtsForm tts={tts} />
        <AudioCommandLog command={tts.lastCommand} />
      </div>
    </div>
  )
}
