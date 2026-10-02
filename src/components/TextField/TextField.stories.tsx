import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RowModeContext } from '../TableRow/RowMode'
import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { value: 'Waterfall_30' },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Read: Story = {
  args: { value: 'Waterfall_30' },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'read', selected: false }}><Story /></RowModeContext.Provider>],
}

export const Selected: Story = {
  args: { value: 'Waterfall_30' },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'read', selected: true }}><Story /></RowModeContext.Provider>],
}

export const Edit: Story = {
  render: function EditStory() {
    const [value, setValue] = useState('Church')
    return (
      <RowModeContext.Provider value={{ mode: 'edit', selected: false }}>
        <TextField value={value} onChange={setValue} aria-label="Name" />
      </RowModeContext.Provider>
    )
  },
}

export const Error: Story = {
  args: {
    value: 'Waterfall_30',
    'aria-label': 'Name',
    error: 'An object called Waterfall_30 already exists. Names must be unique within a project.',
  },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'edit', selected: false }}><Story /></RowModeContext.Provider>],
}

export const Disabled: Story = {
  args: { value: 'Old Mill' },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'disabled', selected: false }}><Story /></RowModeContext.Provider>],
}

export const LongTruncating: Story = {
  name: 'Long, truncating',
  args: { value: 'temperate rainforest canopy — dense understory, old growth' },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'read', selected: false }}><Story /></RowModeContext.Provider>],
}
