// Chuẩn hóa âm thoại phát âm giọng nói sang thuật ngữ kỹ thuật
export const normalizeStatusMessage = (text: string): string => {
  return text.replace(/\bai[\s-]*pi\b/gi, 'IP').replace(/(?<=\d)\s*(?:chấm|dot)\s*(?=\d)/gi, '.')
}
