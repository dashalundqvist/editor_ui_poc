import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, type ButtonSize, type ButtonTone } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Add object',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Prominent: Story = {
  args: { size: 'prominent', tone: 'primary' },
}

export const Compact: Story = {
  args: { size: 'compact', tone: 'neutral' },
}

export const WithIcon: Story = {
  args: { size: 'prominent', tone: 'primary', icon: 'Add' },
}

export const Destructive: Story = {
  args: { tone: 'destructive', children: 'Delete' },
}

export const Disabled: Story = {
  args: { tone: 'primary', disabled: true },
}

const SIZES: ButtonSize[] = ['prominent', 'compact']
const TONES: ButtonTone[] = ['primary', 'neutral', 'destructive']

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-group)' }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', gap: 'var(--spacing-stack)', alignItems: 'center' }}>
          {TONES.map((tone) => (
            <Button key={tone} size={size} tone={tone}>
              Add object
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}
