// Các tiện ích tạo kênh truyền thông điệp MQTT cho từng robot cụ thể
export const getStatusTopic = (botId: string): string => `${botId}/status`

export const getCommandsTopic = (botId: string): string => `${botId}/commands`
