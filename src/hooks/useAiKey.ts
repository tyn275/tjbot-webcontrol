import { useState, useCallback } from 'react'
import {
  getAiApiKey,
  setAiApiKey,
  removeAiApiKey,
  hasAiApiKey,
} from '../services/storage/ai-key.storage'

export const useAiKey = () => {
  const [apiKey, setApiKey] = useState<string>(() => getAiApiKey())

  const saveKey = useCallback((newKey: string): void => {
    setAiApiKey(newKey)
    setApiKey(newKey.trim())
  }, [])

  const clearKey = useCallback((): void => {
    removeAiApiKey()
    setApiKey('')
  }, [])

  return {
    apiKey,
    saveKey,
    clearKey,
    hasKey: hasAiApiKey(),
  }
}
