const AI_API_KEY_STORAGE = 'tjbot_ai_session_key'

// Đọc khóa API từ phiên làm việc tạm thời của trình duyệt
export const getAiApiKey = (): string => {
  try {
    return sessionStorage.getItem(AI_API_KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

// Lưu khóa API vào phiên làm việc tạm thời của trình duyệt
export const setAiApiKey = (apiKey: string): boolean => {
  try {
    sessionStorage.setItem(AI_API_KEY_STORAGE, apiKey.trim())
    return true
  } catch {
    return false
  }
}

// Xóa khóa API khỏi phiên làm việc tạm thời của trình duyệt
export const removeAiApiKey = (): void => {
  try {
    sessionStorage.removeItem(AI_API_KEY_STORAGE)
  } catch {
    // Bỏ qua ngoại lệ bộ nhớ bị chặn
  }
}

// Kiểm tra sự tồn tại của khóa API trong phiên làm việc
export const hasAiApiKey = (): boolean => {
  return Boolean(getAiApiKey())
}
