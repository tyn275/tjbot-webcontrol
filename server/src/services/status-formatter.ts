export const normalizeStatusMessage = (text: string): string => {
  return text.replace(/\bai[\s-]*pi\b/gi, 'IP').replace(/(?<=\d)\s*(?:chấm|dot)\s*(?=\d)/gi, '.')
}
