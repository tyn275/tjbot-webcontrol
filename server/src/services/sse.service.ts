import type { ServerResponse } from 'node:http'

const sseClients = new Set<ServerResponse>()
let onEmptyClientsCallback: (() => void) | null = null

export const setOnEmptyClients = (callback: () => void): void => {
  onEmptyClientsCallback = callback
}

export const registerSseClient = (res: ServerResponse): void => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })
  res.write('\n')
  sseClients.add(res)
  res.on('close', () => {
    sseClients.delete(res)
    if (sseClients.size === 0 && onEmptyClientsCallback) {
      onEmptyClientsCallback()
    }
  })
}

export const broadcastRobotStatus = (topic: string, text: string): void => {
  const payload = JSON.stringify({ topic, message: text })
  for (const client of sseClients) {
    client.write(`data: ${payload}\n\n`)
  }
}
