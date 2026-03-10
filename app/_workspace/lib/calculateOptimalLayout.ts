import { WorkspaceObjectData } from '../types'

/**
 * calculateWorkspaceLayout
 *
 * Grid-based layout with deterministic scatter.
 *
 * 1. Chooses a grid (cols × rows) that fits all objects in the viewport.
 * 2. Sizes objects so they fit within cells with breathing room.
 * 3. Scatters each object within its cell using a seeded random offset
 *    so the layout feels organic but never overlaps.
 * 4. Overlap is checked with axis-aligned bounding boxes (AABB)
 *    that account for object width, height, and the label below.
 *
 * Placement is deterministic: same slugs → same positions across reloads.
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

/**
 * Stable pseudo-random from a string seed (0–1 range).
 */
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) / 2147483647
}

/**
 * Deterministic scatter value from slug + axis, range -1 to 1.
 */
function getScatter(slug: string, axis: 'x' | 'y'): number {
  return (seededRandom(`${slug}-${axis}`) - 0.5) * 2
}

/**
 * AABB overlap check — objects overlap when both axes are too close.
 */
function overlaps(
  ax: number, ay: number,
  bx: number, by: number,
  minDistX: number, minDistY: number,
): boolean {
  return Math.abs(ax - bx) < minDistX && Math.abs(ay - by) < minDistY
}

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
  const verticalPadding = isMobile ? 130 : 80
  const maxObjSize = isSmallMobile ? 100 : isMobile ? 120 : MAX_OBJECT_SIZE
  const availableWidth = viewportWidth - horizontalPadding * 2
  const availableHeight = viewportHeight - verticalPadding * 2

  // Choose grid dimensions — prefer wider than tall to match landscape viewports
  const aspect = availableWidth / availableHeight
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * aspect)))
  const rows = Math.max(1, Math.ceil(count / cols))

  // Largest object size that fits the grid
  const maxByWidth = (availableWidth - GAP * (cols - 1)) / cols
  const maxByHeight = (availableHeight - GAP * (rows - 1)) / rows - LABEL_HEIGHT
  const objectSize = Math.max(
    MIN_OBJECT_SIZE,
    Math.min(maxObjSize, Math.floor(Math.min(maxByWidth, maxByHeight))),
  )

  // Minimum centre-to-centre distances (no overlap possible below these)
  const minDistX = objectSize + GAP
  const minDistY = objectSize + LABEL_HEIGHT + GAP

  // Cell dimensions
  const cellW = availableWidth / cols
  const cellH = availableHeight / rows

  // Max scatter within a cell — ensures object stays inside its cell
  const maxScatterX = Math.max(0, (cellW - minDistX) / 2)
  const maxScatterY = Math.max(0, (cellH - minDistY) / 2)

  const placed: Array<{ id: string; x: number; y: number }> = []

  objects.forEach((obj, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)

    // Cell centre in pixels
    const cellCenterX = horizontalPadding + cellW * (col + 0.5)
    const cellCenterY = verticalPadding + cellH * (row + 0.5)

    // Deterministic scatter
    let px = cellCenterX + getScatter(obj.slug, 'x') * maxScatterX
    let py = cellCenterY + getScatter(obj.slug, 'y') * maxScatterY

    // Clamp within safe area
    const halfObj = objectSize / 2
    px = Math.max(horizontalPadding + halfObj, Math.min(viewportWidth - horizontalPadding - halfObj, px))
    py = Math.max(verticalPadding, Math.min(viewportHeight - verticalPadding - LABEL_HEIGHT, py))

    // Safety nudge — converge toward cell centre if still overlapping
    for (let attempt = 0; attempt < 8; attempt++) {
      const hasOverlap = placed.some(p => overlaps(px, py, p.x, p.y, minDistX, minDistY))
      if (!hasOverlap) break
      px += (cellCenterX - px) * 0.3
      py += (cellCenterY - py) * 0.3
    }

    placed.push({ id: obj.id, x: px, y: py })
  })

  // Return pixel positions — avoids JS/CSS viewport width mismatch
  return { canvasHeight: viewportHeight, objectSize, positions: placed }
}

// Legacy exports
export const calculateOptimalLayout = calculateWorkspaceLayout
export type OptimalLayout = WorkspaceLayout
