export type CommandArg = string | number | boolean

// Đóng gói tham số chuỗi qua nháy kép để phía robot giải mã an toàn qua ast.literal_eval
export const buildCommand = (name: string, ...args: readonly CommandArg[]): string => {
  const formattedArgs = args.map((arg) =>
    typeof arg === 'string' ? JSON.stringify(arg) : String(arg)
  )
  return `${name}(${formattedArgs.join(', ')})`
}
