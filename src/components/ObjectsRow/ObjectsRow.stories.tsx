import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TableRowState } from '../TableRow/TableRow'
import type { DropdownOption } from '../Dropdown/Dropdown'
import { ObjectsRow, type ObjectsRowBlockingReason } from './ObjectsRow'

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'landmark', label: 'landmark' },
  { value: 'starting-location', label: 'starting-location' },
  { value: 'prop', label: 'prop' },
]

const TAG_COLOURS: Record<string, string> = {
  forrest: '#54a19c',
  grassland: '#8583c7',
  urban: '#c99b3f',
  ruins: '#b45a5a',
  ocean: '#5a8fb4',
}

function tags(...labels: string[]) {
  return labels.map((label) => ({ label, color: TAG_COLOURS[label] }))
}

const meta = {
  title: 'Components/ObjectsRow',
  component: ObjectsRow,
  args: {
    categoryOptions: CATEGORY_OPTIONS,
    name: 'Waterfall_30',
    category: 'landmark',
    min: 20,
    max: 80,
    tags: tags('forrest', 'grassland'),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1140 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ObjectsRow>

export default meta
type Story = StoryObj<typeof meta>

// --- Every state, one real object (Waterfall_30) -------------------------

export const Default: Story = { args: { state: 'default' } }
export const Selected: Story = { args: { state: 'selected' } }
export const Disabled: Story = { args: { state: 'disabled' } }
export const Editing: Story = { args: { state: 'editing' } }
export const Saving: Story = { args: { state: 'saving' } }
export const Invalid: Story = { args: { state: 'invalid', min: undefined, max: undefined } }
export const Blocked: Story = {
  args: {
    state: 'blocked',
    blockingReason: {
      field: 'name',
      message: 'An object called Waterfall_30 already exists. Names must be unique within a project.',
    } satisfies ObjectsRowBlockingReason,
  },
}
export const SaveFailed: Story = { name: 'Save failed', args: { state: 'save-failed' } }

// --- Workflow 3 · Objects tab — real content, read from Figma -------------

type RowData = {
  state: TableRowState
  name: string
  category: string
  min?: number
  max?: number
  tagLabels: string[]
  blockingReason?: ObjectsRowBlockingReason
}

const OBJECTS_TAB_ROWS: RowData[] = [
  { state: 'default', name: 'Waterfall_30', category: 'landmark', min: 20, max: 80, tagLabels: ['forrest', 'grassland'] },
  { state: 'default', name: 'Church', category: 'landmark', min: 70, max: 90, tagLabels: ['urban', 'ruins'] },
  { state: 'editing', name: 'player-start', category: 'starting-location', min: 30, max: 70, tagLabels: [] },
  { state: 'default', name: 'Pond', category: 'landmark', min: 10, max: 40, tagLabels: ['forrest', 'ocean'] },
  { state: 'invalid', name: 'Old Mill', category: 'landmark', tagLabels: ['urban', 'forrest'] },
  { state: 'default', name: 'Rubbish bin', category: 'prop', min: 0, max: 10, tagLabels: ['urban', 'grassland'] },
]

const ERROR_MOMENT_ROWS: RowData[] = [
  { state: 'default', name: 'Waterfall_30', category: 'landmark', min: 20, max: 80, tagLabels: ['forrest', 'grassland'] },
  { state: 'default', name: 'Church', category: 'landmark', min: 70, max: 90, tagLabels: ['forrest', 'grassland'] },
  {
    state: 'blocked',
    name: 'Waterfall_30',
    category: 'starting-location',
    min: 30,
    max: 70,
    tagLabels: [],
    blockingReason: {
      field: 'name',
      message: 'An object called Waterfall_30 already exists. Names must be unique within a project.',
    },
  },
  { state: 'default', name: 'Pond', category: 'landmark', min: 10, max: 40, tagLabels: ['forrest', 'grassland'] },
  { state: 'invalid', name: 'Old Mill', category: 'landmark', tagLabels: ['forrest', 'grassland'] },
  { state: 'invalid', name: 'Fence', category: 'prop', tagLabels: ['forrest', 'grassland'] },
]

function ObjectsTable({ rows, density }: { rows: RowData[]; density?: 'compact' }) {
  return (
    <div data-testid="objects-table" data-density={density}>
      {rows.map((row, i) => (
        <ObjectsRow
          key={`${row.name}-${i}`}
          state={row.state}
          name={row.name}
          category={row.category}
          categoryOptions={CATEGORY_OPTIONS}
          min={row.min}
          max={row.max}
          tags={tags(...row.tagLabels)}
          blockingReason={row.blockingReason}
        />
      ))}
    </div>
  )
}

export const WorkflowObjectsTab: Story = {
  name: 'Workflow 3 · Objects tab',
  render: () => <ObjectsTable rows={OBJECTS_TAB_ROWS} />,
}

export const WorkflowErrorMoment: Story = {
  name: 'Workflow 3 · Objects tab · error moment',
  render: () => <ObjectsTable rows={ERROR_MOMENT_ROWS} />,
}

export const WorkflowObjectsTabCompact: Story = {
  name: 'Workflow 3 · Objects tab (Compact)',
  render: () => <ObjectsTable rows={OBJECTS_TAB_ROWS} density="compact" />,
}

/* The real-world version of TableRow's own height-invariance demo: cycling
 * an actual Objects row (with a real Dropdown, RangeField and TagList beside
 * the Name field, not just a bare TextField) through Default → Editing →
 * Blocked and measuring it never changes height. */
const HEIGHT_DEMO_SEQUENCE: TableRowState[] = ['default', 'editing', 'blocked']

export const HeightNeverChanges: Story = {
  name: 'Default → Editing → Blocked (height never changes)',
  render: function HeightDemo(args) {
    const [index, setIndex] = useState(0)
    const [heights, setHeights] = useState<number[]>([])
    const state = HEIGHT_DEMO_SEQUENCE[index]

    useEffect(() => {
      const row = document.querySelector('[data-height-probe]')
      if (!row) return
      setHeights((prev) => [...prev, row.getBoundingClientRect().height])
      if (index < HEIGHT_DEMO_SEQUENCE.length - 1) {
        const timeout = setTimeout(() => setIndex((i) => i + 1), 700)
        return () => clearTimeout(timeout)
      }
    }, [index])

    return (
      <div style={{ color: 'var(--foreground-primary)' }}>
        <p style={{ marginBottom: 8 }}>
          State: <strong>{state}</strong> — measured heights so far: {heights.map((h) => `${h}px`).join(', ')}
        </p>
        <div data-height-probe>
          <ObjectsRow
            {...args}
            state={state}
            blockingReason={
              state === 'blocked'
                ? { field: 'name', message: 'An object called Waterfall_30 already exists.' }
                : undefined
            }
          />
        </div>
      </div>
    )
  },
}
