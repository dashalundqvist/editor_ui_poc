import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagList, type TagListItem } from './TagList'

const COLOURS = ['#54a19c', '#8583c7', '#c99b3f', '#b45a5a', '#5a8fb4', '#7fae5a', '#a45ab4', '#b48a5a', '#5ab49a', '#b45a8f']

function makeTags(labels: string[]): TagListItem[] {
  return labels.map((label, i) => ({ label, color: COLOURS[i % COLOURS.length] }))
}

const meta = {
  title: 'Components/TagList',
  component: TagList,
  args: {
    objectName: 'Waterfall_30',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagList>

export default meta
type Story = StoryObj<typeof meta>

export const ShortTags: Story = {
  args: { tags: makeTags(['ocean', 'urban']) },
}

export const LongTruncatingTags: Story = {
  args: {
    tags: makeTags(['temperate rainforest canopy', 'coastal grassland reserve', 'urban']),
  },
}

export const TenTags: Story = {
  args: {
    tags: makeTags([
      'ocean',
      'forrest',
      'urban',
      'grassland',
      'desert',
      'tundra',
      'wetland',
      'mountain',
      'savanna',
      'reef',
    ]),
  },
}

export const OneTag: Story = {
  args: { tags: makeTags(['ocean']) },
}

export const NoTags: Story = {
  args: { tags: [] },
}
