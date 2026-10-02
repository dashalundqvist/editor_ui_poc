import type { Meta, StoryObj } from '@storybook/react-vite'
import { RowModeContext } from '../TableRow/RowMode'
import { TextField } from '../TextField/TextField'
import { Cell } from './Cell'

const meta = {
  title: 'Components/Cell',
  component: Cell,
  decorators: [
    (Story) => (
      <RowModeContext.Provider value={{ mode: 'read', selected: false }}>
        <div style={{ display: 'flex', width: 400, background: 'var(--background-panel)' }}>
          <Story />
        </div>
      </RowModeContext.Provider>
    ),
  ],
} satisfies Meta<typeof Cell>

export default meta
type Story = StoryObj<typeof meta>

export const AlignStart: Story = {
  args: { width: 240, align: 'start', children: <TextField value="Waterfall_30" /> },
}

export const AlignEnd: Story = {
  args: { width: 240, align: 'end', children: <TextField value="20–80" /> },
}

export const Flexible: Story = {
  name: 'Flexible (no width)',
  args: { children: <TextField value="Fills whatever space is left" /> },
}
