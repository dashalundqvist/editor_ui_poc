import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {
  args: { tone: 'neutral', glyph: 'Add', 'aria-label': 'Add object' },
}

export const Destructive: Story = {
  args: { tone: 'destructive', glyph: 'Delete', 'aria-label': 'Delete Waterfall_30' },
}

export const Disabled: Story = {
  args: { tone: 'destructive', glyph: 'Delete', 'aria-label': 'Delete Waterfall_30', disabled: true },
}
