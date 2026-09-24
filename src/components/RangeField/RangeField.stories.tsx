import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeField } from './RangeField'

const meta = {
  title: 'Components/RangeField',
  component: RangeField,
} satisfies Meta<typeof RangeField>

export default meta
type Story = StoryObj<typeof meta>

export const ReadSet: Story = {
  args: { state: 'read', min: 70, max: 90 },
}

export const ReadSingleFigure: Story = {
  args: { state: 'read', min: 40, max: 40 },
}

export const ReadNotSet: Story = {
  args: { state: 'read' },
}

export const Disabled: Story = {
  args: { state: 'disabled', min: 70, max: 90 },
}

export const DisabledNotSet: Story = {
  args: { state: 'disabled' },
}

export const Edit: Story = {
  render: function EditStory() {
    const [min, setMin] = useState<number | undefined>(20)
    const [max, setMax] = useState<number | undefined>(80)
    return <RangeField state="edit" min={min} max={max} onMinChange={setMin} onMaxChange={setMax} />
  },
}

export const EditNotSet: Story = {
  render: function EditNotSetStory() {
    const [min, setMin] = useState<number | undefined>(undefined)
    const [max, setMax] = useState<number | undefined>(undefined)
    return <RangeField state="edit" min={min} max={max} onMinChange={setMin} onMaxChange={setMax} />
  },
}

const SPANS: Array<[number, number]> = [
  [0, 10],
  [10, 30],
  [30, 50],
  [50, 70],
  [70, 90],
  [90, 100],
  [0, 100],
  [40, 40],
]

export const AllBands: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-stack)',
        color: 'var(--foreground-primary)',
      }}
    >
      {SPANS.map(([min, max]) => (
        <RangeField key={`${min}-${max}`} state="read" min={min} max={max} />
      ))}
    </div>
  ),
}
