import { i18n } from '../../i18n/i18n'

type LogListener = (entry: string) => void
const listeners = new Set<LogListener>()

const formatCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export const subscribeLogs = (listener: LogListener): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const appendLog = (message: string): void => {
  const entry = `[${formatCurrentTime()}] ${message}`
  listeners.forEach((fn) => fn(entry))
}

export const logStartingNetwork = (url: string): void => {
  appendLog(i18n.t('logStartingNetwork', { url }))
}

export const logConnectSuccess = (topic: string): void => {
  appendLog(i18n.t('logConnectSuccess', { topic }))
}

export const logDisconnectedManual = (): void => {
  appendLog(i18n.t('logDisconnectedManual'))
}

export const logCommandSent = (botId: string, command: string): void => {
  appendLog(i18n.t('logCommandSent', { topic: `${botId}/commands`, command }))
}

export const logCommandError = (command: string): void => {
  appendLog(i18n.t('logCommandError', { command }))
}

export const logStatusReceive = (topic: string, message: string): void => {
  appendLog(i18n.t('logStatusReceive', { topic, message }))
}

export const logDirectMessage = (message: string): void => {
  appendLog(message)
}

export const logNavigated = (route: string): void => {
  appendLog(i18n.t('logNavigated', { route }))
}

export const logSidebarToggle = (collapsed: boolean): void => {
  appendLog(i18n.t(collapsed ? 'logSidebarCollapsed' : 'logSidebarExpanded'))
}
