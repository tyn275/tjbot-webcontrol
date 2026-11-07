// Các khóa định danh lưu trữ cục bộ trong trình duyệt
export const STORAGE_KEYS = {
  BOT_ID: 'tjbot_device_id',
  GEMINI_API_KEY: 'gemini_api_key',
} as const

// Đọc chuỗi an toàn từ bộ nhớ trình duyệt có xử lý ngoại lệ chế độ ẩn danh
export const getItem = (key: string, defaultValue = ''): string => {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? value : defaultValue
  } catch {
    return defaultValue
  }
}

// Ghi chuỗi an toàn vào bộ nhớ trình duyệt
export const setItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

// Đọc và giải mã dữ liệu đối tượng JSON từ bộ nhớ trình duyệt
export const getJson = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

// Chuyển đổi đối tượng và ghi dữ liệu JSON an toàn
export const setJson = <T>(key: string, data: T): boolean => {
  try {
    const jsonString = JSON.stringify(data)
    return setItem(key, jsonString)
  } catch {
    return false
  }
}

// Xóa một khóa dữ liệu khỏi bộ nhớ trình duyệt
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Bỏ qua lỗi khi trình duyệt chặn quyền xóa trong chế độ ẩn danh
  }
}

// Lấy mã định danh Robot đã lưu hoặc trả về giá trị mặc định
export const getSavedBotId = (defaultId = 'tjbot1'): string => {
  return getItem(STORAGE_KEYS.BOT_ID, defaultId)
}

// Lưu mã định danh Robot vào bộ nhớ trình duyệt
export const saveBotId = (botId: string): void => {
  setItem(STORAGE_KEYS.BOT_ID, botId.trim())
}
