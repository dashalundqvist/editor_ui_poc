import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: {
    label: 'river',
    color: '#54a19c',
    objectName: 'Waterfall_30',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Short: Story = {}

export const LongTruncating: Story = {
  args: { label: 'temperate rainforest canopy — dense understory' },
}

export const NotRemovable: Story = {
  args: { removable: false },
}

export const DarkAuthorColour: Story = {
  args: { label: 'urban', color: '#0a1f10' },
}
