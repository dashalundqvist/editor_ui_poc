import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'
import { RowModeContext, type RowMode } from './RowMode'
import styles from './TableRow.module.css'

export type TableRowState =
  | 'default'
  | 'selected'
  | 'disabled'
  | 'editing'
  | 'saving'
  | 'invalid'
  | 'blocked'
  | 'save-failed'

type TableRowProps = {
  state?: TableRowState
  /** Each table declares its own — Objects uses 148px (decision 23: sized to
   * the action group's widest state, "Saving…"). Not a default: a row shell
   * with no opinion about Objects shouldn't quietly assume Objects' number. */
  actionsWidth: number
  /** Full accessible name for the row's own Edit icon button, e.g.
   * "Edit Waterfall_30" — composed by whoever calls this, not assembled here
   * from a name the row isn't given (decision 36: no Objects-specific props). */
  editLabel: string
  deleteLabel: string
  onEdit?: () => void
  onDelete?: () => void
  onSave?: () => void
  /** Cell instances — the row's columns. */
  children: ReactNode
}

const EDIT_MODE_STATES: TableRowState[] = ['editing', 'saving', 'blocked', 'save-failed']

function modeFor(state: TableRowState): RowMode {
  if (state === 'disabled') return 'disabled'
  if (EDIT_MODE_STATES.includes(state)) return 'edit'
  return 'read'
}

/* A table row shell (decisions 36–37): owns row state, the 3px status
 * indicator, the action group, and padding/density. Takes its columns as
 * children. See RowMode.ts for how "edit mode" reaches the atoms inside
 * those children — it's context, not a prop threaded through every Cell. */
export function TableRow({ state = 'default', actionsWidth, editLabel, deleteLabel, onEdit, onDelete, onSave, children }: TableRowProps) {
  const isEditMode = EDIT_MODE_STATES.includes(state)
  const selected = state === 'selected'
  const hoverable = state === 'default' || state === 'invalid'

  const indicatorClass =
    state === 'save-failed'
      ? styles.indicatorSaveFailed
      : state === 'invalid' || state === 'blocked'
        ? styles.indicatorError
        : selected
          ? styles.indicatorSelected
          : undefined

  const surfaceClass = isEditMode ? styles.surfaceSubtle : selected ? styles.surfaceSelected : styles.surfaceDefault

  return (
    <RowModeContext.Provider value={{ mode: modeFor(state), selected }}>
      <div className={cx(styles.row, surfaceClass, hoverable && styles.hoverable)}>
        <div className={styles.content}>
          <div className={cx(styles.indicator, indicatorClass)} />
          <div className={styles.cells}>
            <div className={styles.cellsSlot}>{children}</div>
            <div className={styles.actions} style={{ width: actionsWidth }}>
              {isEditMode &&
                (state === 'saving' ? (
                  // Stays visually the enabled Primary look on purpose.
                  // aria-disabled + aria-busy (never the disabled attribute)
                  // so a keyboard user doesn't lose focus mid-press — the
                  // no-op click is the real guard (decision 33).
                  <Button
                    tone="primary"
                    size="compact"
                    icon="Loading"
                    spinning
                    aria-disabled="true"
                    aria-busy="true"
                    onClick={() => {}}
                  >
                    Saving…
                  </Button>
                ) : (
                  <Button tone="primary" size="compact" disabled={state === 'blocked'} onClick={onSave}>
                    Save
                  </Button>
                ))}
              {!isEditMode && (
                <IconButton glyph="Edit" tone="neutral" aria-label={editLabel} onClick={onEdit} disabled={state === 'disabled'} />
              )}
              <IconButton glyph="Delete" tone="neutral" aria-label={deleteLabel} onClick={onDelete} disabled={state === 'disabled'} />
            </div>
          </div>
        </div>
      </div>
    </RowModeContext.Provider>
  )
}
