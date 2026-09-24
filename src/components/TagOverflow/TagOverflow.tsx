import a11y from '../../styles/a11y.module.css'
import styles from './TagOverflow.module.css'

type TagOverflowProps = {
  hiddenLabels: string[]
}

/* How many tags a row isn't showing, so an object with two tags can be told
 * apart from one with eleven. The visible "+N" is decorative; the hidden span
 * names what's actually cut off, so a screen reader user doesn't just hear a
 * number.
 *
 * Non-interactive for now. Figma marks this clickable ("opens the full
 * list"), but that destination hasn't been designed yet — do not wire an
 * onClick until it has. */
export function TagOverflow({ hiddenLabels }: TagOverflowProps) {
  const count = hiddenLabels.length

  return (
    <div className={styles.tagOverflow}>
      <span aria-hidden="true">+{count}</span>
      <span className={a11y.visuallyHidden}>
        {count} more: {hiddenLabels.join(', ')}
      </span>
    </div>
  )
}
