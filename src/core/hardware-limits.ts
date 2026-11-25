// Các hằng số giới hạn vật lý và ngưỡng an toàn của phần cứng robot
export const HARDWARE_LIMITS = {
  ARM_ANGLE_MIN: -90,
  ARM_ANGLE_MAX: 90,
  TTS_MAX_WORDS: 200,
  ARM_REALTIME_THROTTLE_MS: 60,
} as const

const CJK_REGEX = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/

export const isCjkText = (text: string): boolean => {
  return CJK_REGEX.test(text)
}

export const clampTimes = (val: number, min = 1, max = 20): number => {
  if (Number.isNaN(val)) return min
  return Math.max(min, Math.min(Math.round(val), max))
}

// Giới hạn góc quay servo cánh tay luôn nằm trong ngưỡng an toàn
export const clampArmAngle = (angle: number): number => {
  return Math.min(Math.max(angle, HARDWARE_LIMITS.ARM_ANGLE_MIN), HARDWARE_LIMITS.ARM_ANGLE_MAX)
}

const truncateCjk = (text: string, maxChars: number): string => {
  const chars = Array.from(text)
  let count = 0
  let result = ''
  for (const char of chars) {
    if (!/\s/.test(char)) count++
    if (count > maxChars) break
    result += char
  }
  return result
}

// Cắt tỉa văn bản nếu vượt quá số từ hoặc số ký tự CJK tối đa của bộ đệm âm thanh
export const truncateTtsText = (
  text: string,
  maxWords: number = HARDWARE_LIMITS.TTS_MAX_WORDS,
  isCjk = false
): string => {
  const trimmed = text.trim()
  if (isCjk || isCjkText(trimmed)) return truncateCjk(trimmed, maxWords)
  const words = trimmed.split(/\s+/)
  return words.length <= maxWords ? trimmed : words.slice(0, maxWords).join(' ')
}
