import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import styles from './Cell.module.css'

type CellProps = {
  /** Column width in px. Omit for a flexible column (e.g. Tags) that fills
   * whatever space is left. */
  width?: number
  align?: 'start' | 'end'
  children: ReactNode
}

/** One generic table cell (Figma node 20:2987). Holds any atom — TextField,
 * Dropdown, RangeField, TagList, buttons — and owns only alignment, vertical
 * centring and clipping. */
export function Cell({ width, align = 'start', children }: CellProps) {
  const style = width === undefined ? { flex: '1 0 0' } : { width, flex: 'none' }
  return (
    <div className={cx(styles.cell, align === 'end' && styles.alignEnd)} style={style}>
      {children}
    </div>
  )
}
