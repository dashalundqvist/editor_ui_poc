import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cell } from '../Cell/Cell'
import { TextField } from '../TextField/TextField'
import { TableRow, type TableRowState } from './TableRow'

const meta = {
  title: 'Components/TableRow',
  component: TableRow,
  args: {
    actionsWidth: 148,
    editLabel: 'Edit Waterfall_30',
    deleteLabel: 'Delete Waterfall_30',
    children: (
      <Cell width={240}>
        <TextField value="Waterfall_30" aria-label="Name" />
      </Cell>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { state: 'default' } }
export const Hover: Story = {
  name: 'Hover (forced for review)',
  args: { state: 'default' },
  decorators: [
    (Story) => (
      <div style={{ width: 600 }} className="force-hover-demo">
        <style>{`.force-hover-demo > div { background: var(--background-hover) !important; }`}</style>
        <Story />
      </div>
    ),
  ],
}
export const Selected: Story = { args: { state: 'selected' } }
export const Disabled: Story = { args: { state: 'disabled' } }
export const Editing: Story = {
  args: {
    state: 'editing',
    children: (
      <Cell width={240}>
        <TextField value="Church" aria-label="Name" />
      </Cell>
    ),
  },
}
export const Saving: Story = { args: { state: 'saving' } }
export const Invalid: Story = { args: { state: 'invalid' } }
export const Blocked: Story = {
  args: {
    state: 'blocked',
    children: (
      <Cell width={240}>
        <TextField value="Waterfall_30" aria-label="Name" error="An object called Waterfall_30 already exists." />
      </Cell>
    ),
  },
}
export const SaveFailed: Story = { name: 'Save failed', args: { state: 'save-failed' } }

/* The actual point of decisions 36–37: switching through every state —
 * including entering/leaving Blocked, which replaces an input with plain
 * text and back — never changes the row's own measured height. */
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
      const height = row.getBoundingClientRect().height
      setHeights((prev) => [...prev, height])
      if (index < HEIGHT_DEMO_SEQUENCE.length - 1) {
        const timeout = setTimeout(() => setIndex((i) => i + 1), 600)
        return () => clearTimeout(timeout)
      }
    }, [index])

    return (
      <div style={{ color: 'var(--foreground-primary)' }}>
        <p style={{ marginBottom: 8 }}>
          State: <strong>{state}</strong> — measured heights so far: {heights.map((h) => `${h}px`).join(', ')}
        </p>
        <div data-height-probe>
          <TableRow {...args} state={state}>
            <Cell width={240}>
              <TextField
                value="Waterfall_30"
                aria-label="Name"
                error={state === 'blocked' ? 'An object called Waterfall_30 already exists.' : undefined}
              />
            </Cell>
          </TableRow>
        </div>
      </div>
    )
  },
}
