import { Icon } from '../Icon/Icon'
import styles from './Tag.module.css'

type TagProps = {
  label: string
  color: string
  objectName: string
  removable?: boolean
  onRemove?: () => void
}

/* A tile type an object references — ocean, forrest, urban, grassland. The
 * pill stays neutral and the label always names the tile type; only the
 * small swatch dot carries the author's arbitrary colour. */
export function Tag({ label, color, objectName, removable = true, onRemove }: TagProps) {
  return (
    <div className={styles.tag}>
      <span className={styles.swatch} style={{ backgroundColor: color }} />
      <span className={styles.label}>{label}</span>
      {removable && (
        <button
          type="button"
          className={styles.remove}
          aria-label={`Remove ${label} from ${objectName}`}
          onClick={onRemove}
        >
          <Icon glyph="Remove" className={styles.icon} />
        </button>
      )}
    </div>
  )
}
