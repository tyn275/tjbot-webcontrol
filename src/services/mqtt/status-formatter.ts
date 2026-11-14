// Chuan hoa am thoai phat am giong noi sang thuat ngu ky thuat
export const normalizeStatusMessage = (text: string): string => {
  return text.replace(/\bai[\s-]*pi\b/gi, 'IP').replace(/(?<=\d)\s*(?:chấm|dot)\s*(?=\d)/gi, '.')
}
