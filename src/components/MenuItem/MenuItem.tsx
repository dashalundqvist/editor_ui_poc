import { cx } from '../../lib/cx'
import { Icon } from '../Icon/Icon'
import styles from './MenuItem.module.css'

type MenuItemProps = {
  id?: string
  label: string
  selected?: boolean
  highlighted?: boolean
  disabled?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}

/* One row in an overlay menu (Figma node 8:4065). Not focusable itself — the
 * listbox pattern keeps real DOM focus on the trigger and points at this via
 * aria-activedescendant (see Dropdown.tsx), which is also why there's no
 * tabIndex or onKeyDown here. */
export function MenuItem({ id, label, selected = false, highlighted = false, disabled = false, onClick, onMouseEnter }: MenuItemProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cx(styles.item, highlighted && styles.highlighted, disabled && styles.disabled)}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onMouseEnter}
    >
      <span className={cx(styles.label, selected && styles.selected)}>{label}</span>
      {selected && <Icon glyph="Confirm" className={styles.check} />}
    </li>
  )
}
