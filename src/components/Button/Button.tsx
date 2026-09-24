import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Icon, type IconGlyph } from '../Icon/Icon'
import styles from './Button.module.css'

export type ButtonSize = 'prominent' | 'compact'
export type ButtonTone = 'primary' | 'neutral' | 'destructive'

type ButtonProps = {
  size?: ButtonSize
  tone?: ButtonTone
  icon?: IconGlyph
  /** Spins the leading icon — the Saving state's "Loading" glyph. */
  spinning?: boolean
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

/* Primary is the only filled tone, and it means this action commits work — at most
 * one per view. Default tone is neutral so that meaning has to be chosen, not
 * inherited by accident. */
export function Button({
  size = 'prominent',
  tone = 'neutral',
  icon,
  spinning = false,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cx(styles.button, styles[size], styles[tone])} {...rest}>
      {icon && <Icon glyph={icon} className={cx(styles.icon, spinning && styles.spinner)} />}
      {children}
    </button>
  )
}
