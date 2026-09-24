export type IconGlyph =
  | 'Add'
  | 'Remove'
  | 'Delete'
  | 'Edit'
  | 'Loading'
  | 'Confirm'
  | 'Alert'
  | 'Expand'
  | 'Help'
  | 'Info'

/* Path data exported from the Icon component set in Figma (node 7:3331) — 16×16
 * grid, 1.5px stroke, round caps. If a glyph needs to change, change it in Figma
 * and re-export; do not hand-edit a path here.
 *
 * Remove takes something out of a set (a tag off an object); Delete destroys the
 * record. They are visually distinct on purpose — do not swap one for the other. */
const PATHS: Record<IconGlyph, string> = {
  Add: 'M8 3.25V12.75M3.25 8H12.75',
  Remove: 'M3.9 3.9L12.1 12.1M12.1 3.9L3.9 12.1',
  Delete: 'M2.75 4.5H13.25M6.5 4.5V2.75H9.5V4.5M4.25 4.5L4.9 13.25H11.1L11.75 4.5',
  Edit: 'M9.475 4.025L11.975 6.525M2.825 13.175L3.325 10.175L10.675 2.825L13.175 5.325L5.825 12.675L2.825 13.175Z',
  Loading:
    'M11.2 8H13.8M10.26 10.26L12.1 12.1M8 11.2V13.8M5.74 10.26L3.9 12.1M4.8 8H2.2M5.74 5.74L3.9 3.9M8 4.8V2.2M10.26 5.74L12.1 3.9',
  Confirm: 'M3.4 8.25L6.5 11.55L12.6 4.45',
  Alert: 'M8 6.6V9.6M8 11.5V11.55M8 2.6L14.2 13.4H1.8L8 2.6Z',
  Expand: 'M4.2 6L8 10L11.8 6',
  Help: 'M5.2 6C5.2 4.2 6.4 3 8 3C9.6 3 10.8 4.2 10.8 5.8C10.8 7.4 9.6 8 8.7 8.7C8.2 9.1 8 9.6 8 10.5M8 13H8.05',
  Info: 'M8 7.4V11.2M8 4.9H8.05M8 2.1C11.26 2.1 13.9 4.74 13.9 8C13.9 11.26 11.26 13.9 8 13.9C4.74 13.9 2.1 11.26 2.1 8C2.1 4.74 4.74 2.1 8 2.1Z',
}

type IconProps = {
  glyph: IconGlyph
  className?: string
}

/* Stroke is currentColor — per the Figma component description, colour is set by
 * whatever holds the icon, never here. Decorative by default: the accessible name
 * belongs to the control this icon sits inside (see IconButton). */
export function Icon({ glyph, className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[glyph]} />
    </svg>
  )
}
