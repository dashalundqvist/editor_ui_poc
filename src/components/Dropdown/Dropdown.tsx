import { useContext, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'
import { Icon } from '../Icon/Icon'
import { MenuItem } from '../MenuItem/MenuItem'
import { RowModeContext } from '../TableRow/RowMode'
import styles from './Dropdown.module.css'

export type DropdownOption = {
  value: string
  label: string
  disabled?: boolean
}

type DropdownProps = {
  value: string
  options: DropdownOption[]
  /** Error message. Presence triggers the Error state — ignored while the
   * row's mode is Disabled. */
  error?: string
  onChange?: (value: string) => void
  onExplainError?: () => void
  'aria-label'?: string
}

function labelFor(options: DropdownOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}

function nextEnabledIndex(options: DropdownOption[], from: number, direction: 1 | -1): number {
  for (let i = from + direction; i >= 0 && i < options.length; i += direction) {
    if (!options[i].disabled) return i
  }
  return from
}

/* Single choice from a fixed list, for a table cell (Figma node 20:3315).
 * Mode comes from context, like TextField. Uses the standard
 * combobox-with-listbox-popup ARIA pattern: real DOM focus stays on the
 * trigger throughout, aria-activedescendant points at the highlighted
 * option, so MenuItem itself never needs to be focusable. */
export function Dropdown({ value, options, error, onChange, onExplainError, 'aria-label': ariaLabel }: DropdownProps) {
  const { mode } = useContext(RowModeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!isOpen) return
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  const selectedLabel = labelFor(options, value)

  if (mode === 'disabled') {
    return (
      <span className={styles.disabled} title={selectedLabel}>
        {selectedLabel}
      </span>
    )
  }

  if (mode === 'read') {
    return (
      <span className={styles.read} title={selectedLabel}>
        {selectedLabel}
      </span>
    )
  }

  function open() {
    const currentIndex = options.findIndex((option) => option.value === value)
    setHighlighted(currentIndex >= 0 ? currentIndex : 0)
    setIsOpen(true)
  }

  function selectOption(option: DropdownOption) {
    if (option.disabled) return
    onChange?.(option.value)
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open()
      }
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((i) => nextEnabledIndex(options, i, 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((i) => nextEnabledIndex(options, i, -1))
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(options[highlighted])
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={cx(styles.box, error && styles.error)}>
        <button
          type="button"
          className={styles.trigger}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={isOpen ? `${listId}-${highlighted}` : undefined}
          aria-label={ariaLabel}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.value}>{selectedLabel}</span>
          <Icon glyph="Expand" className={styles.chevron} />
        </button>
        {error && (
          <button type="button" className={styles.explain} aria-label={error} onClick={onExplainError}>
            <Icon glyph="Info" className={styles.explainIcon} />
          </button>
        )}
      </div>
      {isOpen && (
        <ul className={styles.menu} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => (
            <MenuItem
              key={option.value}
              id={`${listId}-${index}`}
              label={option.label}
              selected={option.value === value}
              highlighted={index === highlighted}
              disabled={option.disabled}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setHighlighted(index)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
