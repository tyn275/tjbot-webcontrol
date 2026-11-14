import { buildCommand } from '../../services/mqtt/command'

export type MuscleState = 'on' | 'off'
export type WaveSpeed = 'fast' | 'low'

// Tạo lệnh điều khiển góc quay servo cánh tay robot qua cổng phát lệnh tập trung
export const buildArmCommand = (angle: number): string => {
  return buildCommand('Arm', angle)
}

// Tạo lệnh điều khiển trạng thái cơ bắp cánh tay qua cổng phát lệnh tập trung
export const buildMuscleCommand = (state: MuscleState): string => {
  return buildCommand('Muscle', state)
}

// Tạo lệnh kích hoạt kịch bản vẫy tay theo số lần và tốc độ qua cổng phát lệnh tập trung
export const buildWavehandCommand = (speed: WaveSpeed, times: number): string => {
  return buildCommand('Wavehand', speed, times)
}

// Tạo lệnh dừng kịch bản vẫy tay khẩn cấp qua cổng phát lệnh tập trung
export const buildStopWaveCommand = (): string => {
  return buildCommand('Wavehand', 'off')
}
