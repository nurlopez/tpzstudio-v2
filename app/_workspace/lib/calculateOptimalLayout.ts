import { WorkspaceObjectData } from '../types'

/**
 * calculateWorkspaceLayout
 *
 * Clean aligned grid layout.
 *
 * 1. Chooses a grid (cols × rows) that fits all objects in the viewport.
 * 2. Sizes objects so they fit within cells with breathing room.
 * 3. Places each object at its grid cell center — no scatter.
 * 4. Objects appear in array order (left-to-right, top-to-bottom).
 *
 * The top region is reserved for the greeting text so objects
 * never overlap with it.
 */
export interface WorkspaceLayout {
  canvasHeight: number
  objectSize: number
  positions: Array<{ id: string; x: number; y: number }>
}

// Sizing constants
const MIN_OBJECT_SIZE = 100
const MAX_OBJECT_SIZE = 160
const LABEL_HEIGHT = 40 // Space reserved for the label below the object
const GAP = 30 // Minimum gap between object edges
const MOBILE_BREAKPOINT = 640

// Greeting reservation — keeps objects below the greeting block
const GREETING_RESERVE_DESKTOP = 160 // px from top reserved for greeting
const GREETING_RESERVE_MOBILE = 180

export function calculateWorkspaceLayout(
  objects: WorkspaceObjectData[],
  viewportWidth: number,
  viewportHeight: number,
): WorkspaceLayout {
  if (objects.length === 0) {
    return { canvasHeight: viewportHeight, objectSize: MAX_OBJECT_SIZE, positions: [] }
  }

  const count = objects.length
  const isMobile = viewportWidth < MOBILE_BREAKPOINT
  const isSmallMobile = viewportWidth < 400
  const horizontalPadding = isMobile ? 30 : 60
  const greetingReserve = isMobile ? GREETING_RESERVE_MOBILE : GREETING_RESERVE_DESKTOP
  const bottomPadding = isMobile ? 100 : 60
  const maxObjSize = isSmallMobile ? 100 : isMobile ? 120 : MAX_OBJECT_SIZE
  const availableWidth = viewportWidth - horizontalPadding * 2
  const availableHeight = viewportHeight - greetingReserve - bottomPadding

  // Choose grid dimensions — prefer wider than tall to match landscape viewports
  const aspect = availableWidth / Math.max(1, availableHeight)
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * aspect)))
  const rows = Math.max(1, Math.ceil(count / cols))

  // Largest object size that fits the grid
  const maxByWidth = (availableWidth - GAP * (cols - 1)) / cols
  const maxByHeight = (availableHeight - GAP * (rows - 1)) / rows - LABEL_HEIGHT
  const objectSize = Math.max(
    MIN_OBJECT_SIZE,
    Math.min(maxObjSize, Math.floor(Math.min(maxByWidth, maxByHeight))),
  )

  // Cell dimensions
  const cellW = availableWidth / cols
  const cellH = availableHeight / rows

  // Center the last row if it has fewer items than cols
  const lastRowCols = count % cols || cols

  const placed: Array<{ id: string; x: number; y: number }> = []

  objects.forEach((obj, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    const isLastRow = row === rows - 1
    const rowCols = isLastRow ? lastRowCols : cols

    // Center each row horizontally within the available width
    const rowWidth = rowCols * cellW
    const rowOffsetX = horizontalPadding + (availableWidth - rowWidth) / 2

    // Cell centre in pixels
    const px = rowOffsetX + cellW * (col + 0.5)
    const py = greetingReserve + cellH * (row + 0.5)

    placed.push({ id: obj.id, x: px, y: py })
  })

  // Return pixel positions — avoids JS/CSS viewport width mismatch
  return { canvasHeight: viewportHeight, objectSize, positions: placed }
}

// Legacy exports
export const calculateOptimalLayout = calculateWorkspaceLayout
export type OptimalLayout = WorkspaceLayout
