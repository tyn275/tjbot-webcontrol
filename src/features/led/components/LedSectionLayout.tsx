import { useLayoutEffect, useRef, type FC, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LedBulbSim } from './LedBulbSim'

interface LedSectionLayoutProps {
  readonly hexColor: string
  readonly labelKey: string
  readonly titleKey: string
  readonly children: ReactNode
  readonly className?: string
}

export const LedSectionLayout: FC<LedSectionLayoutProps> = ({
  hexColor,
  labelKey,
  titleKey,
  children,
  className = '',
}) => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    sectionRef.current?.style.setProperty('--led-sim-color', hexColor)
  }, [hexColor])

  return (
    <div ref={sectionRef} className={`row align-items-center ${className}`}>
      <div className="col-auto text-center border-end pe-4 me-2">
        <LedBulbSim labelKey={labelKey} />
      </div>
      <div className="col">
        <label className="form-label fw-semibold text-secondary small mb-1">{t(titleKey)}</label>
        {children}
      </div>
    </div>
  )
}
