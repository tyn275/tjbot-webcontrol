import { useRef, useEffect, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { drawDialBackground, drawArmPointer } from './angle-dial.canvas'
import { useDialDrag } from '../hooks/useDialDrag'

interface Props {
  readonly angle: number
  readonly onChange: (next: number) => void
  readonly onCommit: () => void
}

// Đĩa tròn trực quan hóa và tương tác kéo góc servo cánh tay
export const AngleDial: FC<Props> = ({ angle, onChange, onCommit }) => {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { onMouseDown } = useDialDrag({ canvasRef, onChange, onCommit })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawDialBackground(ctx, canvas.width)
    drawArmPointer(ctx, canvas.width, angle)
  }, [angle])

  return (
    <div className="text-center border-end pe-4 me-2 arm-dial">
      <div className="p-2 rounded d-flex flex-column align-items-center justify-content-center border arm-dial__box">
        <canvas
          ref={canvasRef}
          width={120}
          height={120}
          className="arm-dial__canvas"
          onMouseDown={onMouseDown}
        />
        <div className="mt-2 fw-bold arm-dial__label">{t('arm.angleDisplay', { angle })}</div>
      </div>
    </div>
  )
}
