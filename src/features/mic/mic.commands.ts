import { buildCommand } from '../../services/mqtt/command'
import type { MicLanguage } from './mic.types'

// Các hàm khởi tạo chuỗi lệnh MQTT cho phân hệ Microphone thông qua buildCommand

// Tạo lệnh thu âm và nói nhại lại qua loa robot
export const buildRecordCommand = (state: 'on' | 'off', timeout = 5): string => {
  return state === 'on' ? buildCommand('Record', state, timeout) : buildCommand('Record', state)
}

// Tạo lệnh lắng nghe và nhận diện giọng nói AI chuyển đổi thành văn bản
export const buildListenCommand = (
  state: 'on' | 'off',
  timeout = 5,
  lang: MicLanguage = 'vi-VN'
): string => {
  return state === 'on'
    ? buildCommand('Listen', state, timeout, lang)
    : buildCommand('Listen', state)
}
