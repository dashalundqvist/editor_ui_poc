import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { RowModeContext } from '../TableRow/RowMode'
import { Dropdown, type DropdownOption } from './Dropdown'

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'landmark', label: 'landmark' },
  { value: 'starting-location', label: 'starting-location' },
  { value: 'prop', label: 'prop' },
]

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: { options: CATEGORY_OPTIONS, value: 'landmark' },
  decorators: [
    (Story) => (
      // Dropdown fills 100% of its container by design (it lives inside a
      // fixed-width Cell in real use) — constrain it here so standalone
      // stories render at a realistic column width instead of full-viewport.
      <div style={{ width: 180, paddingBottom: 150 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Read: Story = {
  args: { value: 'landmark' },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'read', selected: false }}><Story /></RowModeContext.Provider>],
}

export const Edit: Story = {
  render: function EditStory(args) {
    const [value, setValue] = useState('starting-location')
    return (
      <RowModeContext.Provider value={{ mode: 'edit', selected: false }}>
        <Dropdown {...args} value={value} onChange={setValue} aria-label="Category" />
      </RowModeContext.Provider>
    )
  },
}

export const Open: Story = {
  render: function OpenStory(args) {
    const [value, setValue] = useState('starting-location')
    return (
      <RowModeContext.Provider value={{ mode: 'edit', selected: false }}>
        <Dropdown {...args} value={value} onChange={setValue} aria-label="Category" />
      </RowModeContext.Provider>
    )
  },
  // The Open state only exists after a real click — this is the first click,
  // not a separate visual-only variant, so a play function (not a prop) is
  // the honest way to demonstrate it.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Category' }))
  },
}

export const ErrorState: Story = {
  name: 'Error',
  args: {
    value: 'starting-location',
    'aria-label': 'Category',
    error: 'An object called Waterfall_30 already exists. Names must be unique within a project.',
  },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'edit', selected: false }}><Story /></RowModeContext.Provider>],
}

export const Disabled: Story = {
  args: { value: 'landmark' },
  decorators: [(Story) => <RowModeContext.Provider value={{ mode: 'disabled', selected: false }}><Story /></RowModeContext.Provider>],
}
