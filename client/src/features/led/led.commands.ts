import { buildCommand } from '../../services/mqtt/command'

// Danh mục ánh xạ màu cơ bản đã đăng ký sẵn trong bảng màu phần cứng của robot
export const COLOR_MAP: Record<string, string> = {
  '#FF0000': 'red',
  '#00FF00': 'green',
  '#0000FF': 'blue',
  '#A020F0': 'purple',
  '#FFFF00': 'yellow',
  '#00FFFF': 'cyan',
  '#FF00FF': 'magenta',
  '#FFFFFF': 'white',
  '#000000': 'black',
}

export const resolveColorName = (hexColor: string): string => {
  const normalized = hexColor.toUpperCase()
  return COLOR_MAP[normalized] || normalized
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val || 0)))
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0').toUpperCase()
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export const buildHeadHexCommand = (state: 'on' | 'off', hexColor: string): string => {
  const color = state === 'off' ? 'black' : resolveColorName(hexColor)
  return buildCommand('Head', state, color)
}

export const buildHeadBlinkHexCommand = (
  times: number,
  speed: 'fast' | 'slow',
  hexColor: string
): string => {
  const color = resolveColorName(hexColor)
  return buildCommand('HeadBlink', times, speed, color)
}

export const buildLedOffCommand = (): string => {
  return buildCommand('Head', 'off', 'black')
}

export const buildRainbowCommand = (effect: string): string => {
  return buildCommand('Rainbow', effect)
}
