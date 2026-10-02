import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem } from './MenuItem'

const meta = {
  title: 'Components/MenuItem',
  component: MenuItem,
  args: { label: 'landmark' },
  decorators: [
    (Story) => (
      <ul
        role="listbox"
        aria-label="Category"
        style={{ listStyle: 'none', margin: 0, padding: 0, width: 220, background: 'var(--background-elevated)' }}
      >
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof MenuItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'landmark' },
}

export const Hover: Story = {
  args: { label: 'landmark', highlighted: true },
}

export const Selected: Story = {
  args: { label: 'starting-location', selected: true },
}

export const Disabled: Story = {
  args: { label: 'prop', disabled: true },
}

export const List: Story = {
  render: () => (
    <>
      <MenuItem label="landmark" highlighted />
      <MenuItem label="starting-location" selected />
      <MenuItem label="prop" />
    </>
  ),
}
