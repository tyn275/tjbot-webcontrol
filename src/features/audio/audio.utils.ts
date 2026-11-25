import type { TtsLanguage } from './audio.types'
import { isCjkText } from '../../core/hardware-limits'

export { isCjkText }

// Bảng ánh xạ thời lượng ước tính cho từng file âm thanh có sẵn (đơn vị mili-giây)
export const AUDIO_FILE_DURATIONS: Record<string, number> = {
  'hello.mp3': 2500,
  'bye.mp3': 2500,
  'giongnoivbee.mp3': 7000,
  'truongcntt.dhbkhn.mp3': 8500,
}

// Lấy thời lượng ước tính của file âm thanh theo tên file
export const getAudioFileDurationMs = (filename: string): number => {
  return AUDIO_FILE_DURATIONS[filename] ?? 3000
}

// Đếm số lượng từ hoặc ký tự âm vị dựa trên ngôn ngữ
export const countWords = (text: string, lang: TtsLanguage = 'vi'): number => {
  const trimmed = text.trim()
  if (trimmed === '') return 0
  if (lang === 'ja' || isCjkText(trimmed)) {
    return trimmed.replace(/\s+/g, '').length
  }
  return trimmed.split(/\s+/).length
}

// Tính toán thời gian ngắt nghỉ bổ sung dựa trên dấu câu (đơn vị mili-giây)
const calcPunctuationPauseMs = (text: string): number => {
  const commaMatches = text.match(/[,、]/g)
  const periodMatches = text.match(/[.!?。]/g)
  const commaCount = commaMatches ? commaMatches.length : 0
  const periodCount = periodMatches ? periodMatches.length : 0
  return commaCount * 350 + periodCount * 600
}

// Lấy tốc độ đọc theo từng đơn vị của ngôn ngữ (đơn vị mili-giây)
const getMsPerUnit = (lang: TtsLanguage): number => {
  if (lang === 'ja') return 220
  if (lang === 'en') return 400
  return 350
}

// Ước tính thời lượng phát Text-To-Speech dựa trên ngôn ngữ và dấu câu
export const estimateTtsDurationMs = (text: string, lang: TtsLanguage = 'vi'): number => {
  const units = countWords(text, lang)
  const msPerUnit = getMsPerUnit(lang)
  const baseLatencyMs = 1500
  const pauseMs = calcPunctuationPauseMs(text)
  const total = baseLatencyMs + units * msPerUnit + pauseMs
  return Math.max(2500, total)
}

// Nhận diện gói tin phản hồi từ robot báo hiệu đã hoàn thành phát âm thanh
export const isPlaybackFinishedMessage = (payload: string): boolean => {
  const normalized = payload.toLowerCase()
  return normalized.includes('đã đọc xong') || normalized.includes('đã tắt âm thanh')
}
