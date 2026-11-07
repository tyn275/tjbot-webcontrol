import http from 'node:http'
import { getServerConfig } from './config/env.js'
import { registerSseClient, setOnEmptyClients } from './services/sse.service.js'
import { disconnectMqttClient } from './services/mqtt.service.js'
import {
  handlePostCommand,
  handleGetStatus,
  handlePostConnect,
  handlePostDisconnect,
} from './routes/command.route.js'

const setCorsHeaders = (res: http.ServerResponse): void => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const readRequestBody = (req: http.IncomingMessage): Promise<string> => {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => resolve(body))
  })
}

const handleGetRoute = (req: http.IncomingMessage, res: http.ServerResponse): boolean => {
  if (req.url === '/api/status') {
    handleGetStatus(res)
    return true
  }
  if (req.url === '/api/events') {
    registerSseClient(res)
    return true
  }
  return false
}

const handlePostRoute = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<boolean> => {
  const body = await readRequestBody(req)
  if (req.url === '/api/command') {
    void handlePostCommand(body, res)
    return true
  }
  if (req.url === '/api/connect') {
    void handlePostConnect(body, res)
    return true
  }
  if (req.url === '/api/disconnect') {
    void handlePostDisconnect(res)
    return true
  }
  return false
}

const dispatchRoute = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> => {
  if (req.method === 'GET' && handleGetRoute(req, res)) return
  if (req.method === 'POST' && (await handlePostRoute(req, res))) return
  res.writeHead(404, { 'Content-Type': 'application/json' }).end('{"error":"Not Found"}')
}

export const startServer = (): void => {
  const config = getServerConfig()
  setOnEmptyClients(() => {
    void disconnectMqttClient()
  })

  const server = http.createServer((req, res) => {
    setCorsHeaders(res)
    if (req.method === 'OPTIONS') {
      res.writeHead(204).end()
      return
    }
    void dispatchRoute(req, res)
  })

  server.listen(config.port, () => {
    console.log(`[Server] TJBot Server sẵn sàng tại cổng ${config.port}`)
  })
}

startServer()
