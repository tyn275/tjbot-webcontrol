import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AUDIO_FILES } from '../audio.types'
import { AudioDiskSim } from './AudioDiskSim'
import { SoundPickerButtons } from './SoundPickerButtons'

interface Props {
  readonly selectedFile: string
  readonly isPlaying: boolean
  readonly onSelectFile: (file: string) => void
  readonly onPlay: () => void
  readonly onSilent: () => void
}

// Khối điều khiển phát file âm thanh có sẵn trên bộ nhớ robot (Bi bô)
export const SoundPickerSection: FC<Props> = ({
  selectedFile,
  isPlaying,
  onSelectFile,
  onPlay,
  onSilent,
}) => {
  const { t } = useTranslation()

  return (
    <div className="row g-3 align-items-center mb-3">
      <div className="col-auto">
        <AudioDiskSim variant="bibo" active={isPlaying} labelKey="audio.labelBibo" />
      </div>
      <div className="col">
        <label className="form-label fw-semibold text-secondary small mb-1">
          {t('audio.sectionPlay')}
        </label>
        <div className="d-flex flex-column gap-2 bg-light p-2 rounded border">
          <select
            className="form-select form-select-sm"
            value={selectedFile}
            onChange={(e) => onSelectFile(e.target.value)}
          >
            {AUDIO_FILES.map((f) => (
              <option key={f.value} value={f.value}>
                {t(f.labelKey)}
              </option>
            ))}
          </select>
          <SoundPickerButtons onPlay={onPlay} onSilent={onSilent} />
        </div>
        <div className="text-muted small mt-2 audio__guide">{t('audio.guideText')}</div>
      </div>
    </div>
  )
}
