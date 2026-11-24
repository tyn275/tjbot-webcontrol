import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MicDiskSim } from './MicDiskSim'
import { MicCommandLog } from './MicCommandLog'
import { MicListenControlForm } from './MicListenControlForm'
import type { useMicListen } from '../hooks/useMicListen'

interface Props {
  readonly listen: ReturnType<typeof useMicListen>
}

// Khối chức năng lắng nghe và nhận diện giọng nói AI (Speech to Text)
export const MicListenSection: FC<Props> = ({ listen }) => {
  const { t } = useTranslation()

  return (
    <div className="row g-3 align-items-center">
      <div className="col-auto">
        <MicDiskSim variant="listen" active={listen.isListening} labelKey="mic.labelListen" />
      </div>
      <div className="col mic__sub-col">
        <label className="form-label fw-semibold text-secondary small mb-1">
          {t('mic.sectionListen')}
        </label>
        <MicListenControlForm listen={listen} />
        <MicCommandLog command={listen.lastCommand} />
      </div>
    </div>
  )
}
