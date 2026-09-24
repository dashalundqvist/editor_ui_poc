import type { ChangeEvent } from 'react'
import { cx } from '../../lib/cx'
import a11y from '../../styles/a11y.module.css'
import styles from './RangeField.module.css'

export type RangeFieldState = 'read' | 'edit' | 'disabled'

type RangeFieldProps = {
  state?: RangeFieldState
  min?: number
  max?: number
  onMinChange?: (value: number | undefined) => void
  onMaxChange?: (value: number | undefined) => void
}

const BAND_EDGES = [0, 20, 40, 60, 80, 100]

/* Which of the five quintile bands the [min, max] span touches. Each band is
 * [lower, upper) except the last, whose upper bound is inclusive so 100 lands.
 * This half-open partition means a single figure (min === max) always lights
 * exactly one band, including at a shared edge — e.g. 40 lights only 40–60,
 * not 20–40, because 40 is that band's own lower bound. */
function bandsTouched(min: number, max: number): boolean[] {
  const bands: boolean[] = []
  for (let i = 0; i < 5; i++) {
    const lower = BAND_EDGES[i]
    const upper = BAND_EDGES[i + 1]
    const isLastBand = i === 4
    const belowUpper = isLastBand ? min <= upper : min < upper
    bands.push(belowUpper && max >= lower)
  }
  return bands
}

function formatValue(min: number, max: number): string {
  return min === max ? `${min}` : `${min}–${max}`
}

/* Input is bounded 0–100 integers, so there is no invalid state to represent. */
function parseInput(raw: string): number | undefined {
  if (raw === '') return undefined
  const n = Math.round(Number(raw))
  if (Number.isNaN(n)) return undefined
  return Math.min(100, Math.max(0, n))
}

/* The Attention range for an object. Min may equal max, in which case the value
 * reads as a single figure. The band strip is redundant encoding — aria-hidden —
 * because the figures are the accessible value.
 *
 * A missing value is never an error at the field level — it renders as a plain
 * em dash in --foreground-muted. The row's Invalid indicator carries the fault,
 * not this cell. */
export function RangeField({ state = 'read', min, max, onMinChange, onMaxChange }: RangeFieldProps) {
  if (state === 'edit') {
    return (
      <div className={styles.rangeField}>
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          className={styles.input}
          value={min ?? ''}
          placeholder="–"
          aria-label="Minimum"
          onChange={(event: ChangeEvent<HTMLInputElement>) => onMinChange?.(parseInput(event.target.value))}
        />
        <span className={styles.separator} aria-hidden="true">
          –
        </span>
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          className={styles.input}
          value={max ?? ''}
          placeholder="–"
          aria-label="Maximum"
          onChange={(event: ChangeEvent<HTMLInputElement>) => onMaxChange?.(parseInput(event.target.value))}
        />
      </div>
    )
  }

  const disabled = state === 'disabled'

  if (min === undefined || max === undefined) {
    return (
      <div className={cx(styles.rangeField, styles.display)}>
        <span className={cx(styles.value, styles.valueMuted)} aria-hidden="true">
          —
        </span>
        <span className={a11y.visuallyHidden}>Attention not set</span>
        <div className={styles.bands} aria-hidden="true">
          {BAND_EDGES.slice(0, 5).map((edge) => (
            <div key={edge} className={styles.band} />
          ))}
        </div>
      </div>
    )
  }

  const bands = bandsTouched(min, max)
  const spokenLabel = min === max ? `${min}` : `${min} to ${max}`

  return (
    <div className={cx(styles.rangeField, styles.display)}>
      <span className={cx(styles.value, disabled ? styles.valueDisabled : styles.valueSet)} aria-hidden="true">
        {formatValue(min, max)}
      </span>
      <span className={a11y.visuallyHidden}>{spokenLabel}</span>
      <div className={styles.bands} aria-hidden="true">
        {bands.map((on, i) => (
          <div key={BAND_EDGES[i]} className={cx(styles.band, on && (disabled ? styles.bandOnDisabled : styles.bandOn))} />
        ))}
      </div>
    </div>
  )
}
