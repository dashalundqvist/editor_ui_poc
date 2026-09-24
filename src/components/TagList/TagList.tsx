import { useLayoutEffect, useRef, useState } from 'react'
import { Tag } from '../Tag/Tag'
import { TagOverflow } from '../TagOverflow/TagOverflow'
import tagOverflowStyles from '../TagOverflow/TagOverflow.module.css'
import styles from './TagList.module.css'

export type TagListItem = {
  label: string
  color: string
}

type TagListProps = {
  tags: TagListItem[]
  objectName: string
  onRemove?: (index: number) => void
}

function fitCount(widths: number[], gap: number, available: number): number {
  let used = 0
  for (let i = 0; i < widths.length; i++) {
    const next = used + (i > 0 ? gap : 0) + widths[i]
    if (next > available) return i
    used = next
  }
  return widths.length
}

/* Fitting a +N counter changes how many tags fit, and the counter's own width
 * depends on N — so this can't be solved in one pass. Assume no counter is
 * needed first; if that overflows, reserve space for a counter sized to the
 * current hidden count and re-fit, repeating until the hidden count stops
 * changing. Converges in 1–2 iterations in practice: moving from "+N" to
 * "+N+1" only ever changes the rendered width by a few pixels, and reserving
 * more space can only ever reduce how many tags fit, never increase it — so
 * the hidden count is non-decreasing across iterations. */
function computeVisibleCount(
  tagWidths: number[],
  measureCounterWidth: (hiddenCount: number) => number,
  gap: number,
  available: number,
): number {
  const total = tagWidths.length
  let count = fitCount(tagWidths, gap, available)
  if (count >= total) return total

  let hidden = total - count
  for (let i = 0; i < 5; i++) {
    const reserved = measureCounterWidth(hidden) + gap
    const nextCount = fitCount(tagWidths, gap, available - reserved)
    const nextHidden = total - nextCount
    count = nextCount
    if (nextHidden === hidden) break
    hidden = nextHidden
  }
  return count
}

/* Tags collapse to fit the available width, with a +N counter for the rest.
 * The visible row only ever renders its final, collapsed form — never the
 * full list flashing before it collapses — because the fit is computed inside
 * a layout effect (which commits before the browser paints) from off-screen
 * measurement clones, not from the visible row itself. */
export function TagList({ tags, objectName, onRemove }: TagListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState<number | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const recompute = () => {
      const available = container.getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(container).columnGap) || 0
      const tagWidths = Array.from(measure.querySelectorAll<HTMLElement>('[data-measure-tag]')).map(
        (el) => el.getBoundingClientRect().width,
      )
      const counterEl = measure.querySelector<HTMLElement>('[data-measure-counter]')

      const measureCounterWidth = (hiddenCount: number): number => {
        if (!counterEl) return 0
        counterEl.textContent = `+${hiddenCount}`
        return counterEl.getBoundingClientRect().width
      }

      setVisibleCount(computeVisibleCount(tagWidths, measureCounterWidth, gap, available))
    }

    recompute()
    const observer = new ResizeObserver(recompute)
    observer.observe(container)
    return () => observer.disconnect()
  }, [tags])

  const measured = visibleCount !== null
  const shown = measured ? tags.slice(0, visibleCount) : []
  const hidden = measured ? tags.slice(visibleCount) : []

  return (
    <div>
      <div ref={containerRef} className={styles.row}>
        {shown.map((tag, i) => (
          <Tag
            key={`${tag.label}-${i}`}
            label={tag.label}
            color={tag.color}
            objectName={objectName}
            onRemove={onRemove ? () => onRemove(i) : undefined}
          />
        ))}
        {hidden.length > 0 && <TagOverflow hiddenLabels={hidden.map((tag) => tag.label)} />}
      </div>

      {/* Off-screen measurement clones — one per tag, plus one counter probe —
       * used to size the row above before it ever paints. */}
      <div ref={measureRef} className={styles.measure} aria-hidden="true">
        {tags.map((tag, i) => (
          <div key={`${tag.label}-${i}`} data-measure-tag className={styles.measureItem}>
            <Tag label={tag.label} color={tag.color} objectName={objectName} />
          </div>
        ))}
        <div data-measure-counter className={tagOverflowStyles.tagOverflow} />
      </div>
    </div>
  )
}
