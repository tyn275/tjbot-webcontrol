import type { FC } from 'react'
import { AudioHeader } from './components/AudioHeader'
import { SoundPickerSection } from './components/SoundPickerSection'
import { TtsSection } from './components/TtsSection'
import { useAudioFile } from './hooks/useAudioFile'
import { useAudioTts } from './hooks/useAudioTts'

interface Props {
  readonly botId?: string
  readonly isConnected?: boolean
}

// Bảng điều khiển trung tâm hệ thống âm thanh robot (Audio Controller)
export const AudioPanel: FC<Props> = ({ botId = 'tjbot1', isConnected = false }) => {
  const file = useAudioFile(botId, isConnected)
  const tts = useAudioTts(botId, isConnected)

  return (
    <div className="card p-4 shadow-sm border-0 bg-white h-100">
      <AudioHeader />
      <SoundPickerSection
        selectedFile={file.selectedFile}
        isPlaying={file.isPlaying}
        onSelectFile={file.setSelectedFile}
        onPlay={file.playFile}
        onSilent={file.silent}
      />
      <div className="border-top my-3" />
      <TtsSection tts={tts} />
    </div>
  )
}
