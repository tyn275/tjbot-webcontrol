import { useRef, useEffect, useCallback, type MouseEvent, type RefObject } from 'react'
import { computeAngleFromMouse } from '../components/angle-dial.canvas'

interface DragOptions {
  readonly canvasRef: RefObject<HTMLCanvasElement | null>
  readonly onChange: (angle: number) => void
  readonly onCommit: () => void
}

// Hook hỗ trợ tương tác kéo rê chuột trên Canvas để tính góc quay đĩa
export const useDialDrag = ({ canvasRef, onChange, onCommit }: DragOptions) => {
  const isDragging = useRef(false)

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      isDragging.current = true
      if (canvasRef.current) {
        onChange(computeAngleFromMouse(canvasRef.current, e.clientX, e.clientY))
      }
    },
    [canvasRef, onChange]
  )

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      if (isDragging.current && canvasRef.current) {
        onChange(computeAngleFromMouse(canvasRef.current, e.clientX, e.clientY))
      }
    }
    const onUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        onCommit()
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [canvasRef, onChange, onCommit])

  return { onMouseDown }
}
