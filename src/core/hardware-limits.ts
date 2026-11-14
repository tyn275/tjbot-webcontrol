// Các hằng số giới hạn vật lý và ngưỡng an toàn của phần cứng robot
export const HARDWARE_LIMITS = {
  ARM_ANGLE_MIN: -90,
  ARM_ANGLE_MAX: 90,
  TTS_MAX_WORDS: 200,
  ARM_REALTIME_THROTTLE_MS: 60,
} as const

// Giới hạn góc quay servo cánh tay luôn nằm trong ngưỡng an toàn
export const clampArmAngle = (angle: number): number => {
  return Math.min(Math.max(angle, HARDWARE_LIMITS.ARM_ANGLE_MIN), HARDWARE_LIMITS.ARM_ANGLE_MAX)
}

// Cắt tỉa văn bản nếu vượt quá số từ phát âm tối đa của bộ đệm âm thanh
export const truncateTtsText = (
  text: string,
  maxWords: number = HARDWARE_LIMITS.TTS_MAX_WORDS
): string => {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) {
    return text.trim()
  }
  return words.slice(0, maxWords).join(' ')
}
