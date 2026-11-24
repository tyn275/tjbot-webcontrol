import type { FC } from 'react'
import { MicHeader } from './components/MicHeader'
import { MicRecordSection } from './components/MicRecordSection'
import { MicListenSection } from './components/MicListenSection'
import { useMicRecord } from './hooks/useMicRecord'
import { useMicListen } from './hooks/useMicListen'

interface Props {
  readonly botId?: string
  readonly isConnected?: boolean
}

// Bảng điều khiển trung tâm hệ thống Microphone robot (Mic Controller)
export const MicPanel: FC<Props> = ({ botId = 'tjbot1', isConnected = false }) => {
  const record = useMicRecord(botId, isConnected)
  const listen = useMicListen(botId, isConnected)

  return (
    <div className="card p-4 shadow-sm border-0 bg-white h-100">
      <MicHeader />
      <MicRecordSection record={record} />
      <div className="border-top my-3" />
      <MicListenSection listen={listen} />
    </div>
  )
}
