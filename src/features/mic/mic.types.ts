// Các định nghĩa kiểu dữ liệu cho phân hệ Microphone

export type MicLanguage = 'vi-VN' | 'en-US' | 'ja-JP'

export interface MicLanguageOption {
  readonly value: MicLanguage
  readonly labelKey: string
}

// Danh sách các ngôn ngữ nhận diện giọng nói hỗ trợ trên robot
export const MIC_LANGUAGES: readonly MicLanguageOption[] = [
  { value: 'vi-VN', labelKey: 'mic.langVi' },
  { value: 'en-US', labelKey: 'mic.langEn' },
  { value: 'ja-JP', labelKey: 'mic.langJa' },
] as const

export interface RecordCommandParams {
  readonly state: 'on' | 'off'
  readonly timeout?: number
}

export interface ListenCommandParams {
  readonly state: 'on' | 'off'
  readonly timeout?: number
  readonly lang?: MicLanguage
}
