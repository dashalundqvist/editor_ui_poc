import type { ChangeEvent } from 'react'
import { cx } from '../../lib/cx'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../IconButton/IconButton'
import { RangeField } from '../RangeField/RangeField'
import { TagList, type TagListItem } from '../TagList/TagList'
import { TagOverflow } from '../TagOverflow/TagOverflow'
import styles from './TableRow.module.css'

export type TableRowState = 'default' | 'selected' | 'disabled' | 'editing' | 'saving' | 'invalid' | 'field-error' | 'save-failed'

export type TableRowBlockingReason = {
  /** Which input carries the bad value. Undefined when the block is a
   * missing required field with no bad-value input to mark — Attention
   * unset has no field to redden, since RangeField has no error state of
   * its own by design (its input is bounded). */
  field?: 'name' | 'category'
  message: string
}

type TableRowProps = {
  state?: TableRowState
  name: string
  category: string
  min?: number
  max?: number
  tags: TagListItem[]
  /** Required in spirit whenever state === 'field-error'; describes what's
   * blocking Save, generalised beyond Figma's one literal example (a bad
   * value in one input) to any blocking condition reached before the press —
   * including Attention still being unset after editing an Invalid row. */
  blockingReason?: TableRowBlockingReason

  onNameChange?: (value: string) => void
  onCategoryChange?: (value: string) => void
  onMinChange?: (value: number | undefined) => void
  onMaxChange?: (value: number | undefined) => void
  onRemoveTag?: (index: number) => void

  onEdit?: () => void
  onDelete?: () => void
  onSave?: () => void
  onAddTag?: () => void
  onAddMeta?: () => void
  onExplainFieldError?: () => void
}

const EDIT_MODE_STATES: TableRowState[] = ['editing', 'saving', 'field-error', 'save-failed']

/* A row in the Tiles, Vectors or Objects table. Nine states in Figma
 * (Default/Hover/Selected/Disabled/Editing/Saving/Invalid/Field error/Save
 * failed), collapsed here to eight controllable states plus real CSS :hover —
 * hover is a pointer state a browser produces, not something a caller sets.
 * Every state is exactly 48px content + 1px border = 49px: confirmed nothing
 * built here needs more room, so a row never pushes the ones below it.
 */
export function TableRow({
  state = 'default',
  name,
  category,
  min,
  max,
  tags,
  blockingReason,
  onNameChange,
  onCategoryChange,
  onMinChange,
  onMaxChange,
  onRemoveTag,
  onEdit,
  onDelete,
  onSave,
  onAddTag,
  onAddMeta,
  onExplainFieldError,
}: TableRowProps) {
  const isEditMode = EDIT_MODE_STATES.includes(state)
  const disabled = state === 'disabled'
  const selected = state === 'selected'
  const hoverable = state === 'default' || state === 'invalid'

  const indicatorClass =
    state === 'save-failed'
      ? styles.indicatorSaveFailed
      : state === 'invalid' || state === 'field-error'
        ? styles.indicatorError
        : selected
          ? styles.indicatorSelected
          : undefined

  const surfaceClass = isEditMode ? styles.surfaceSubtle : selected ? styles.surfaceSelected : styles.surfaceDefault

  return (
    <div className={cx(styles.row, surfaceClass, hoverable && styles.hoverable)}>
      <div className={styles.content}>
        <div className={cx(styles.indicator, indicatorClass)} />
        <div className={styles.cells}>
          {isEditMode ? (
            <>
              <div className={cx(styles.input, blockingReason?.field === 'name' && styles.inputError)}>
                <input
                  className={styles.inputField}
                  value={name}
                  aria-label="Name"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange?.(event.target.value)}
                />
                {blockingReason?.field === 'name' && (
                  <button
                    type="button"
                    className={styles.explain}
                    aria-label={blockingReason.message}
                    onClick={onExplainFieldError}
                  >
                    <Icon glyph="Info" className={styles.explainIcon} />
                  </button>
                )}
              </div>

              <div className={cx(styles.categoryInput, blockingReason?.field === 'category' && styles.inputError)}>
                <input
                  className={styles.inputField}
                  value={category}
                  aria-label="Category"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => onCategoryChange?.(event.target.value)}
                />
                <span className={styles.chevron} aria-hidden="true">
                  ▾
                </span>
                {blockingReason?.field === 'category' && (
                  <button
                    type="button"
                    className={styles.explain}
                    aria-label={blockingReason.message}
                    onClick={onExplainFieldError}
                  >
                    <Icon glyph="Info" className={styles.explainIcon} />
                  </button>
                )}
              </div>

              <div className={styles.attention}>
                <RangeField state="edit" min={min} max={max} onMinChange={onMinChange} onMaxChange={onMaxChange} />
              </div>

              {/* Existing tags aren't shown or individually removable here —
               * this matches Figma exactly. Tag management while editing a
               * row isn't designed beyond this "Add tag" entry point. */}
              <div className={styles.tagsEditRow}>
                <IconButton glyph="Add" tone="neutral" aria-label={`Add tag to ${name}`} onClick={onAddTag} />
                {tags.length > 0 && <TagOverflow hiddenLabels={tags.map((tag) => tag.label)} />}
              </div>

              {/* "Meta" has no defined purpose yet — see CLAUDE.md, which
               * doesn't mention it. Structural placeholder only. */}
              <div className={styles.meta}>
                <IconButton glyph="Add" tone="neutral" aria-label={`Add meta to ${name}`} onClick={onAddMeta} />
              </div>

              <div className={styles.actions}>
                {state === 'saving' ? (
                  // Stays visually the enabled Primary look on purpose — see
                  // the state-logic discussion. aria-disabled + aria-busy
                  // (not the disabled attribute) so a keyboard user doesn't
                  // lose focus mid-press; the no-op click is the real guard.
                  <Button tone="primary" size="compact" icon="Loading" spinning aria-disabled="true" aria-busy="true" onClick={() => {}}>
                    Saving…
                  </Button>
                ) : (
                  <Button tone="primary" size="compact" disabled={state === 'field-error'} onClick={onSave}>
                    Save
                  </Button>
                )}
                <IconButton glyph="Delete" tone="neutral" aria-label={`Delete ${name}`} onClick={onDelete} />
              </div>
            </>
          ) : (
            <>
              <span className={selected ? styles.nameSelected : cx(styles.name, disabled && styles.nameDisabled)} title={name}>
                {name}
              </span>
              <span className={cx(styles.category, disabled && styles.categoryDisabled)} title={category}>
                {category}
              </span>
              <div className={styles.attention}>
                <RangeField state={disabled ? 'disabled' : 'read'} min={min} max={max} />
              </div>
              <div className={styles.tagsCell}>
                <TagList tags={tags} objectName={name} onRemove={onRemoveTag} disabled={disabled} />
              </div>
              <div className={styles.meta} />
              <div className={styles.actions}>
                <IconButton glyph="Edit" tone="neutral" aria-label={`Edit ${name}`} onClick={onEdit} disabled={disabled} />
                <IconButton glyph="Delete" tone="neutral" aria-label={`Delete ${name}`} onClick={onDelete} disabled={disabled} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
