import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconGlyph } from './Icon'

const GLYPHS: IconGlyph[] = [
  'Add',
  'Remove',
  'Delete',
  'Edit',
  'Loading',
  'Confirm',
  'Alert',
  'Expand',
  'Help',
  'Info',
]

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: { glyph: 'Add' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Glyph: Story = {}

export const AllGlyphs: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-group)',
        color: 'var(--foreground-primary)',
        padding: 'var(--spacing-panel-padding)',
      }}
    >
      {GLYPHS.map((glyph) => (
        <div
          key={glyph}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-base)' }}
        >
          <Icon glyph={glyph} />
          <span>{glyph}</span>
        </div>
      ))}
    </div>
  ),
}
