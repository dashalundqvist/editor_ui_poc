import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TableRow, type TableRowState } from './TableRow'
import styles from './TableRow.stories.module.css'

const TAGS = [
  { label: 'forrest', color: '#54a19c' },
  { label: 'grassland', color: '#8583c7' },
]

const meta = {
  title: 'Components/TableRow',
  component: TableRow,
  args: {
    name: 'Waterfall_30',
    category: 'landmark',
    min: 20,
    max: 80,
    tags: TAGS,
  },
  decorators: [
    (Story) => (
      <div className={styles.table}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { state: 'default' },
}

export const ForcedHover: Story = {
  args: { state: 'default' },
  decorators: [
    (Story) => (
      <div className={styles.forceHover}>
        <Story />
      </div>
    ),
  ],
}

export const Selected: Story = {
  args: { state: 'selected' },
}

export const Disabled: Story = {
  args: { state: 'disabled' },
}

export const Invalid: Story = {
  args: { state: 'invalid', min: undefined, max: undefined },
}

export const Editing: Story = {
  render: function EditingStory(args) {
    const [name, setName] = useState(args.name)
    const [category, setCategory] = useState(args.category)
    const [min, setMin] = useState<number | undefined>(args.min)
    const [max, setMax] = useState<number | undefined>(args.max)
    return (
      <TableRow
        {...args}
        state="editing"
        name={name}
        category={category}
        min={min}
        max={max}
        onNameChange={setName}
        onCategoryChange={setCategory}
        onMinChange={setMin}
        onMaxChange={setMax}
      />
    )
  },
}

export const Saving: Story = {
  args: { state: 'saving' },
}

export const FieldErrorBadValue: Story = {
  name: 'Field error — bad value',
  args: {
    state: 'field-error',
    name: '',
    blockingReason: { field: 'name', message: 'Name cannot be empty' },
  },
}

export const FieldErrorAttentionUnset: Story = {
  name: 'Field error — Attention unset',
  args: {
    state: 'field-error',
    min: undefined,
    max: undefined,
    blockingReason: { message: 'Attention is required' },
  },
}

export const SaveFailed: Story = {
  name: 'Save failed',
  args: { state: 'save-failed' },
}

export const AllStates: Story = {
  render: (args) => (
    <>
      {(
        [
          'default',
          'selected',
          'disabled',
          'invalid',
          'editing',
          'saving',
          'field-error',
          'save-failed',
        ] as TableRowState[]
      ).map((state) => (
        <TableRow key={state} {...args} state={state} />
      ))}
    </>
  ),
}
