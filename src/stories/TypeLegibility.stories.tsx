import type { Meta, StoryObj } from '@storybook/react-vite'
import styles from '../styles/type.module.css'

/**
 * Confirms the `ss02` OpenType feature (set globally on `body` in tokens.css)
 * is actually disambiguating `I l 1 0 O` in the official Inter release.
 * Figma cannot render this feature, so this story is the only place it can be checked.
 */
const meta = {
  title: 'Foundations/Type Legibility',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Ss02Disambiguation: Story = {
  render: () => (
    <div style={{ padding: 40 }}>
      <p className={styles.bodyEmphasis} style={{ fontWeight: 600 }}>
        Waterfall_30 — this should look heavy
      </p>
      <p className={styles.bodyDefault}>
        Waterfall_3O — the l 1 0 O should be unambiguous
      </p>
    </div>
  ),
}
