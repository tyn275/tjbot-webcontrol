import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MicDiskSim } from './MicDiskSim'
import { MicRecordButtons } from './MicRecordButtons'
import type { useMicRecord } from '../hooks/useMicRecord'

interface Props {
  readonly record: ReturnType<typeof useMicRecord>
}

// Khối điều khiển chức năng nghe và nói nhại lại qua loa robot (Record)
export const MicRecordSection: FC<Props> = ({ record }) => {
  const { t } = useTranslation()

  return (
    <div className="row g-3 align-items-center mb-3">
      <div className="col-auto">
        <MicDiskSim variant="record" active={record.isRecording} labelKey="mic.labelRecord" />
      </div>
      <div className="col mic__sub-col">
        <label className="form-label fw-semibold text-secondary small mb-1">
          {t('mic.sectionRecord')}
        </label>
        <div className="d-flex flex-wrap gap-2 align-items-end bg-light p-2 rounded border">
          <div className="mic__time-box">
            <label className="text-muted small fw-bold d-block mb-1">{t('mic.timeSeconds')}</label>
            <input
              type="number"
              className="form-control form-control-sm text-center"
              value={record.timeout}
              min="2"
              max="20"
              onChange={(e) => record.setTimeoutVal(Number(e.target.value))}
            />
          </div>
          <MicRecordButtons onStart={record.startRecord} onStop={record.stopRecord} />
        </div>
        <div className="text-danger small mt-2 mic__guide fw-semibold">{t('mic.recordNotice')}</div>
      </div>
    </div>
  )
}
