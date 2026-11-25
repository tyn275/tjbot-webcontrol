import { useRef, useEffect, useCallback, type PointerEvent, type RefObject } from 'react'
import { computeAngleFromMouse } from '../components/angle-dial.canvas'

interface DragOptions {
  readonly canvasRef: RefObject<HTMLCanvasElement | null>
  readonly onChange: (angle: number) => void
  readonly onCommit: () => void
}

interface DragState {
  isDragging: boolean
  lastAngle: number
}

const handlePointerMove = (e: globalThis.PointerEvent, state: DragState, opts: DragOptions) => {
  if (!state.isDragging || !opts.canvasRef.current) return
  const next = computeAngleFromMouse(opts.canvasRef.current, e.clientX, e.clientY)
  state.lastAngle = next
  opts.onChange(next)
}

const useDragEvents = (state: DragState, opts: DragOptions) => {
  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => handlePointerMove(e, state, opts)
    const onUp = () => {
      if (!state.isDragging) return
      state.isDragging = false
      opts.onCommit()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [state, opts])
}

// Hook hỗ trợ tương tác kéo rê con trỏ trên Canvas để tính góc quay đĩa
export const useDialDrag = (opts: DragOptions) => {
  const stateRef = useRef<DragState>({ isDragging: false, lastAngle: 0 })
  useDragEvents(stateRef.current, opts)

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLCanvasElement>) => {
      stateRef.current.isDragging = true
      if (opts.canvasRef.current) {
        const next = computeAngleFromMouse(opts.canvasRef.current, e.clientX, e.clientY)
        stateRef.current.lastAngle = next
        opts.onChange(next)
      }
    },
    [opts]
  )

  return { onPointerDown }
}
