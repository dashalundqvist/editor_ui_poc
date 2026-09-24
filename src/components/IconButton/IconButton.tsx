import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { Icon, type IconGlyph } from '../Icon/Icon'
import styles from './IconButton.module.css'

export type IconButtonTone = 'neutral' | 'destructive'

type IconButtonProps = {
  tone?: IconButtonTone
  glyph: IconGlyph
  'aria-label': string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'aria-label'>

/* Icon-only means the accessible name must say what it acts on — "Delete
 * Waterfall_30", never "Delete". aria-label is a required prop, not an
 * afterthought, so a call site cannot silently ship the bad version. */
export function IconButton({ tone = 'neutral', glyph, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx(styles.iconButton, styles[tone])} {...rest}>
      <Icon glyph={glyph} className={styles.icon} />
    </button>
  )
}
