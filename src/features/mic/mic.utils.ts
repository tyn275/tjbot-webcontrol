// Các tiện ích bóc tách phản hồi và giới hạn thời gian phân hệ Microphone

const MIN_TIMEOUT = 2
const MAX_TIMEOUT = 20
const DEFAULT_TIMEOUT = 5

// Giới hạn thời gian thu âm nằm trong khoảng an toàn cho phần cứng (2-20 giây)
export const clampMicTimeout = (val: number): number => {
  if (Number.isNaN(val)) return DEFAULT_TIMEOUT
  return Math.min(MAX_TIMEOUT, Math.max(MIN_TIMEOUT, Math.round(val)))
}

// Bóc tách kết quả văn bản Speech-to-Text từ chuỗi phản hồi MQTT của robot
export const parseSpeechResult = (raw: string): string | null => {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const match = /^s2t=(.*)$/i.exec(trimmed)
  return match && match[1] !== undefined ? match[1].trim() : null
}
