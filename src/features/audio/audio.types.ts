// Định nghĩa các kiểu dữ liệu và cấu hình tùy chọn cho phân hệ âm thanh
export type TtsLanguage = 'vi' | 'en' | 'ja'
export type TtsService = 'Google' | 'FPT' | 'Viettel'

export interface VoiceOption {
  readonly text: string
  readonly value: string
}

export interface AudioFileOption {
  readonly value: string
  readonly labelKey: string
}

export interface LanguageOption {
  readonly value: TtsLanguage
  readonly labelKey: string
}

// Danh mục file âm thanh có sẵn tích hợp trên bộ nhớ của robot
export const AUDIO_FILES: readonly AudioFileOption[] = [
  { value: 'hello.mp3', labelKey: 'audio.fileHello' },
  { value: 'bye.mp3', labelKey: 'audio.fileBye' },
  { value: 'giongnoivbee.mp3', labelKey: 'audio.fileVbee' },
  { value: 'truongcntt.dhbkhn.mp3', labelKey: 'audio.fileAboutUs' },
] as const

// Danh sách ngôn ngữ được hỗ trợ chuyển đổi văn bản thành giọng nói
export const LANGUAGES: readonly LanguageOption[] = [
  { value: 'vi', labelKey: 'audio.langVi' },
  { value: 'en', labelKey: 'audio.langEn' },
  { value: 'ja', labelKey: 'audio.langJa' },
] as const

// Danh mục các nhà cung cấp dịch vụ tổng hợp giọng nói
export const SERVICES: readonly TtsService[] = ['Google', 'FPT', 'Viettel'] as const

// Lưu ý tích hợp: Khi phía robot Raspberry Pi hỗ trợ FPT và Viettel TTS,
// bổ sung các cấu hình voice tương ứng vào VOICE_DATA bên dưới (ví dụ: fpt-nam-bac, viettel-nu-nam)
// Danh sách các giọng đọc chi tiết theo từng quốc gia
export const VOICE_DATA: Record<TtsLanguage, readonly VoiceOption[]> = {
  vi: [
    { text: 'Ban Mai (Nữ Bắc)', value: 'vi-VN-Standard-A' },
    { text: 'Lê Minh (Nam Bắc)', value: 'vi-VN-Standard-B' },
    { text: 'Thu Minh (Nữ Nam)', value: 'vi-VN-Standard-C' },
  ],
  en: [
    { text: 'John (Nam US)', value: 'en-US-Standard-A' },
    { text: 'Mary (Nữ US)', value: 'en-US-Standard-B' },
  ],
  ja: [{ text: 'Sakura (Nữ Nhật)', value: 'ja-JP-Standard-A' }],
} as const
