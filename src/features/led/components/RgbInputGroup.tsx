import type { FC, ChangeEvent } from 'react'

export interface RgbValues {
  readonly r: number
  readonly g: number
  readonly b: number
}

interface Props {
  readonly values: RgbValues
  readonly onChange: (channel: 'r' | 'g' | 'b', val: number) => void
}

interface FieldProps {
  readonly channel: 'r' | 'g' | 'b'
  readonly label: string
  readonly value: number
  readonly onChange: (c: 'r' | 'g' | 'b', v: number) => void
}

const RgbField: FC<FieldProps> = ({ channel, label, value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = Math.max(0, Math.min(255, Number(e.target.value) || 0))
    onChange(channel, num)
  }

  return (
    <div className="input-group input-group-sm flex-nowrap led__rgb-field">
      <span
        className={`input-group-text fw-bold text-white led__rgb-badge led__rgb-badge--${channel}`}
      >
        {label}
      </span>
      <input
        type="number"
        className="form-control text-center led__rgb-input"
        value={value}
        min={0}
        max={255}
        onChange={handleChange}
      />
    </div>
  )
}

export const RgbInputGroup: FC<Props> = ({ values, onChange }) => (
  <div className="d-flex gap-2 w-100">
    <RgbField channel="r" label="R" value={values.r} onChange={onChange} />
    <RgbField channel="g" label="G" value={values.g} onChange={onChange} />
    <RgbField channel="b" label="B" value={values.b} onChange={onChange} />
  </div>
)
