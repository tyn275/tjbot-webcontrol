import { buildCommand } from '../../services/mqtt/command'

export interface TtsCommandParams {
  readonly text: string
  readonly lang: string
  readonly voice: string
  readonly service: string
}

// Tạo lệnh phát file âm thanh có sẵn trên bộ nhớ robot
export const buildPlayAudioCommand = (filename: string): string => {
  return buildCommand('Play', filename)
}

// Tạo lệnh chuyển đổi văn bản thành giọng nói phát qua loa robot
export const buildTtsCommand = (params: TtsCommandParams): string => {
  const { text, lang, voice, service } = params
  return buildCommand('TextToSpeak', text, lang, voice, service)
}

// Tạo lệnh ngắt toàn bộ âm thanh khẩn cấp đang phát trên robot
export const buildSilentCommand = (): string => {
  return buildCommand('Silent')
}
