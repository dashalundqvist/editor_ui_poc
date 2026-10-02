/* Objects' own column widths and actions width — declared once, here, and
 * nowhere else. A future Objects table header must import these same
 * constants rather than repeating the numbers (decision 36/37: column widths
 * belong to the table, shared by header and rows). */
export const OBJECTS_COLUMNS = {
  name: 240,
  category: 180,
  attention: 120,
  meta: 100,
}

export const OBJECTS_ACTIONS_WIDTH = 148
