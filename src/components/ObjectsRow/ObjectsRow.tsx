import { Cell } from '../Cell/Cell'
import { Dropdown, type DropdownOption } from '../Dropdown/Dropdown'
import { IconButton } from '../IconButton/IconButton'
import { RangeField } from '../RangeField/RangeField'
import { TableRow, type TableRowState } from '../TableRow/TableRow'
import { TagList, type TagListItem } from '../TagList/TagList'
import { TagOverflow } from '../TagOverflow/TagOverflow'
import { TextField } from '../TextField/TextField'
import { OBJECTS_ACTIONS_WIDTH, OBJECTS_COLUMNS } from './objectsColumns'
import styles from './ObjectsRow.module.css'

export type ObjectsRowBlockingReason = {
  field?: 'name' | 'category'
  message: string
}

type ObjectsRowProps = {
  state?: TableRowState
  name: string
  category: string
  categoryOptions: DropdownOption[]
  min?: number
  max?: number
  tags: TagListItem[]
  blockingReason?: ObjectsRowBlockingReason

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

const EDIT_MODE_STATES: TableRowState[] = ['editing', 'saving', 'blocked', 'save-failed']

/* The Objects table's row, rebuilt by composition (decision 36) instead of
 * being TableRow itself. RangeField and TagList predate the RowMode context
 * pattern and aren't changing here, so their state is still resolved and
 * passed explicitly rather than read from context. */
export function ObjectsRow({
  state = 'default',
  name,
  category,
  categoryOptions,
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
}: ObjectsRowProps) {
  const isEditMode = EDIT_MODE_STATES.includes(state)
  const disabled = state === 'disabled'

  return (
    <TableRow
      state={state}
      actionsWidth={OBJECTS_ACTIONS_WIDTH}
      editLabel={`Edit ${name}`}
      deleteLabel={`Delete ${name}`}
      onEdit={onEdit}
      onDelete={onDelete}
      onSave={onSave}
    >
      <Cell width={OBJECTS_COLUMNS.name}>
        <TextField
          value={name}
          onChange={onNameChange}
          aria-label="Name"
          error={blockingReason?.field === 'name' ? blockingReason.message : undefined}
          onExplainError={onExplainFieldError}
        />
      </Cell>

      <Cell width={OBJECTS_COLUMNS.category}>
        <Dropdown
          value={category}
          options={categoryOptions}
          onChange={onCategoryChange}
          aria-label="Category"
          error={blockingReason?.field === 'category' ? blockingReason.message : undefined}
          onExplainError={onExplainFieldError}
        />
      </Cell>

      <Cell width={OBJECTS_COLUMNS.attention}>
        <RangeField
          state={disabled ? 'disabled' : isEditMode ? 'edit' : 'read'}
          min={min}
          max={max}
          onMinChange={onMinChange}
          onMaxChange={onMaxChange}
        />
      </Cell>

      <Cell>
        {isEditMode ? (
          // Existing tags aren't shown or individually removable while
          // editing — matches Figma exactly. Tag management beyond this
          // "Add tag" entry point isn't designed.
          <div className={styles.tagsEdit}>
            <IconButton glyph="Add" tone="neutral" aria-label={`Add tag to ${name}`} onClick={onAddTag} />
            {tags.length > 0 && <TagOverflow hiddenLabels={tags.map((tag) => tag.label)} />}
          </div>
        ) : (
          <TagList tags={tags} objectName={name} onRemove={onRemoveTag} disabled={disabled} />
        )}
      </Cell>

      <Cell width={OBJECTS_COLUMNS.meta}>
        {/* "Meta" has no defined purpose yet — see CLAUDE.md, which doesn't
         * mention it. Structural placeholder only. */}
        {isEditMode && <IconButton glyph="Add" tone="neutral" aria-label={`Add meta to ${name}`} onClick={onAddMeta} />}
      </Cell>
    </TableRow>
  )
}
