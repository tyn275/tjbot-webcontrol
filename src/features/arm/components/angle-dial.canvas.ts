// Vẽ trục giữa và vòng bán nguyệt nét đứt mô phỏng cung quay
export const drawDialBackground = (ctx: CanvasRenderingContext2D, size: number): void => {
  const c = size / 2
  ctx.beginPath()
  ctx.arc(c, c, 45, Math.PI * 1.5, Math.PI * 0.5, false)
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(c, c - 45)
  ctx.lineTo(c, c + 45)
  ctx.strokeStyle = '#f0f0f0'
  ctx.stroke()
}

// Vẽ hình chữ nhật bo tròn đại diện cho thanh servo màu cam
const drawArmBar = (ctx: CanvasRenderingContext2D): void => {
  const [w, h, r, x, y] = [45, 12, 3, 0, -6]
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fillStyle = '#f59f00'
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 2
  ctx.fill()
  ctx.stroke()
}

// Vẽ thanh servo cánh tay quay theo góc độ đã cho
export const drawArmPointer = (
  ctx: CanvasRenderingContext2D,
  size: number,
  angleDegrees: number
): void => {
  const c = size / 2
  ctx.save()
  ctx.translate(c, c)
  ctx.rotate((angleDegrees * Math.PI) / 180)
  ctx.beginPath()
  ctx.arc(0, 0, 6, 0, 2 * Math.PI)
  ctx.fillStyle = '#333'
  ctx.fill()
  drawArmBar(ctx)
  ctx.restore()
}

// Tính toán góc độ xoay từ vị trí con trỏ chuột trên thẻ Canvas
export const computeAngleFromMouse = (
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): number => {
  const rect = canvas.getBoundingClientRect()
  const [cx, cy] = [canvas.width / 2, canvas.height / 2]
  const radians = Math.atan2(clientY - rect.top - cy, clientX - rect.left - cx)
  return Math.round((radians * 180) / Math.PI)
}
