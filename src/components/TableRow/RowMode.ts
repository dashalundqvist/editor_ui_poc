import { createContext } from 'react'

/* TableRow's 9 states collapse to this 3-value baseline for its atoms — the
 * row has no idea what Name, Category or Attention ARE (decision 36), so it
 * can only tell its children "read" / "edit" / "disabled", never which field
 * (if any) is wrong. `selected` is carried separately: only a text value in
 * its Read form responds to it (the Name column, by convention — Category
 * never has), so it can't be folded into `mode` itself. */
export type RowMode = 'read' | 'edit' | 'disabled'

export type RowContextValue = {
  mode: RowMode
  selected: boolean
}

export const RowModeContext = createContext<RowContextValue>({ mode: 'read', selected: false })
