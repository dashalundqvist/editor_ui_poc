import { useContext, type ChangeEvent } from 'react'
import { cx } from '../../lib/cx'
import { Icon } from '../Icon/Icon'
import { RowModeContext } from '../TableRow/RowMode'
import styles from './TextField.module.css'

type TextFieldProps = {
  value: string
  /** Error message. Presence triggers the Error state — ignored while the
   * row's mode is Disabled (decision 36: the atom owns its own field error). */
  error?: string
  onChange?: (value: string) => void
  onExplainError?: () => void
  'aria-label'?: string
}

/* Single-line text value for a table cell (Figma node 20:2978). Mode comes
 * from the enclosing TableRow via context, not a prop — see RowMode.ts.
 * Truncates with an ellipsis; the full value is always in `title`. */
export function TextField({ value, error, onChange, onExplainError, 'aria-label': ariaLabel }: TextFieldProps) {
  const { mode, selected } = useContext(RowModeContext)

  if (mode === 'disabled') {
    return (
      <span className={styles.disabled} title={value}>
        {value}
      </span>
    )
  }

  if (mode === 'read') {
    return (
      <span className={cx(styles.read, selected && styles.selected)} title={value}>
        {value}
      </span>
    )
  }

  return (
    <div className={cx(styles.edit, error && styles.error)}>
      <input
        className={styles.input}
        value={value}
        aria-label={ariaLabel}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
      />
      {error && (
        <button type="button" className={styles.explain} aria-label={error} onClick={onExplainError}>
          <Icon glyph="Info" className={styles.explainIcon} />
        </button>
      )}
    </div>
  )
}
