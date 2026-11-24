import type { FC } from 'react'
import { TtsTextInput } from './TtsTextInput'
import { TtsCountrySelect } from './TtsCountrySelect'
import { TtsVoiceSelect } from './TtsVoiceSelect'
import { TtsServiceSelect } from './TtsServiceSelect'
import { TtsButtons } from './TtsButtons'
import type { useAudioTts } from '../hooks/useAudioTts'

interface Props {
  readonly tts: ReturnType<typeof useAudioTts>
}

// Khung form nhập văn bản và tùy chọn giọng đọc TTS
export const TtsForm: FC<Props> = ({ tts }) => {
  return (
    <div className="d-flex flex-column gap-2 p-2 bg-light rounded border">
      <TtsTextInput
        text={tts.text}
        wordCount={tts.wordCount}
        isOverLimit={tts.isOverLimit}
        onTextChange={tts.setText}
      />
      <div className="row g-2">
        <div className="col-12 col-sm-4">
          <TtsCountrySelect lang={tts.lang} onLangChange={tts.setLang} />
        </div>
        <div className="col-12 col-sm-4">
          <TtsVoiceSelect lang={tts.lang} voice={tts.voice} onVoiceChange={tts.setVoice} />
        </div>
        <div className="col-12 col-sm-4">
          <TtsServiceSelect service={tts.service} onServiceChange={tts.setService} />
        </div>
      </div>
      <TtsButtons onSpeak={tts.speak} onSilent={tts.silent} />
    </div>
  )
}
