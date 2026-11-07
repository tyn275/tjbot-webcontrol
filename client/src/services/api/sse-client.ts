import { env } from '../../core/env'
import { logStatusReceive } from '../logger/log.service'

interface SsePayload {
  readonly topic: string
  readonly message: string
}

export const initSseRobotStatus = (): (() => void) => {
  const eventSource = new EventSource(`${env.apiUrl}/api/events`)

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as SsePayload
      if (data.topic && data.message) {
        logStatusReceive(data.topic, data.message)
      }
    } catch {
      // Bỏ qua gói tin không đúng định dạng json
    }
  }

  return () => {
    eventSource.close()
  }
}
