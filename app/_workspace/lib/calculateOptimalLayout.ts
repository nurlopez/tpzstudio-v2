import { WorkspaceObjectData } from '../types'

/**
 * calculateWorkspaceLayout
 * 
 * SIMPLIFIED: All objects fit within viewport
 * 
 * Objects are scattered within the viewport with breathing space.
 * Object size is adjusted to ensure all objects fit.
 * 
 * Position priority:
 * 1. Objects with positions from Sanity are preserved (used as-is)
 * 2. Objects without positions get deterministic positions generated
 * 3. Generated positions avoid conflicts with existing positions
 * 4. All positions ensure minimum breathing space between objects
 * 
 * Object placement is deterministic: same objects appear in same positions
 * across reloads, based on object identity (slug).
 */
export interface WorkspaceLayout {
  canvasHeight: number // Always equals viewport height
  objectSize: number // Object width in pixels (height is natural, adjusted to fit all objects)
  positions: Array<{ id: string; x: number; y: number }> // Positions as percentages (0-100%)
}

// Object sizing constants
const MIN_OBJECT_SIZE = 120 // Minimum object width in pixels
const MAX_OBJECT_SIZE = 180 // Maximum object width in pixels
const MIN_SPACING = 120 // Minimum space between object centers in pixels
const HORIZONTAL_PADDING = 60 // Padding from viewport edges (horizontal)
const VERTICAL_PADDING = 80 // Padding from viewport top/bottom

/**
 * Generate a stable pseudo-random value from a string seed
 * Same input always produces same output
 */
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Convert to 0-1 range
  return Math.abs(hash) / 2147483647
}

/**
 * Generate stable position variation from object slug
 * Returns value between -1 and 1 for organic scatter
 */
function getPositionVariation(slug: string, axis: 'x' | 'y'): number {
  const seed = `${slug}-${axis}`
  return (seededRandom(seed) - 0.5) * 2 // -1 to 1
}

export function calculateWorkspaceLayout(
  objects: WorkspaceObjectData[],
  viewportWidth: number,
  viewportHeight: number
): WorkspaceLayout {
  if (objects.length === 0) {
    return {
      canvasHeight: viewportHeight,
      objectSize: MAX_OBJECT_SIZE,
      positions: [],
    }
  }

  // Separate objects with and without positions
  const objectsWithPositions = objects.filter(obj => obj.position !== undefined)
  const objectsWithoutPositions = objects.filter(obj => obj.position === undefined)

  // Convert existing positions from percentage to pixels for conflict checking
  const existingPositions: Array<{ id: string; x: number; y: number }> = objectsWithPositions.map(obj => ({
    id: obj.id,
    x: (obj.position!.x / 100) * viewportWidth,
    y: (obj.position!.y / 100) * viewportHeight,
  }))

  // Calculate available space within viewport
  const availableWidth = viewportWidth - (HORIZONTAL_PADDING * 2)
  const availableHeight = viewportHeight - (VERTICAL_PADDING * 2)

  // Find optimal object size that fits all objects
  // Try different sizes from MAX to MIN until all objects fit
  let objectSize = MAX_OBJECT_SIZE
  let allObjectsFit = false

  while (objectSize >= MIN_OBJECT_SIZE && !allObjectsFit) {
    // Use object width for horizontal constraints (height is natural)
    const objectHalfWidth = objectSize / 2
    const minX = HORIZONTAL_PADDING + objectHalfWidth
    const maxX = viewportWidth - HORIZONTAL_PADDING - objectHalfWidth
    // Vertical constraints use padding (objects can have natural heights)
    const minY = VERTICAL_PADDING
    const maxY = viewportHeight - VERTICAL_PADDING

    // Check if existing positions fit within bounds
    const existingPositionsFit = existingPositions.every(pos => {
      return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY
    })

    if (!existingPositionsFit) {
      objectSize -= 5
      continue
    }

    // Try to place objects without positions
    const testPositions: Array<{ x: number; y: number }> = [...existingPositions]
    let fits = true

    objectsWithoutPositions.forEach((obj, index) => {
      // Base vertical position (evenly distributed among objects without positions)
      const verticalSpacing = objectsWithoutPositions.length > 0 
        ? availableHeight / (objectsWithoutPositions.length + 1)
        : availableHeight / 2
      const baseY = VERTICAL_PADDING + (verticalSpacing * (index + 1))
      
      // Add deterministic variation (max 30% of spacing)
      const yVariation = getPositionVariation(obj.slug, 'y') * (verticalSpacing * 0.3)
      const finalY = Math.max(minY, Math.min(maxY, baseY + yVariation))
      
      // Horizontal position with deterministic variation
      const centerX = viewportWidth / 2
      const xVariation = getPositionVariation(obj.slug, 'x') * ((maxX - minX) * 0.4)
      const finalX = Math.max(minX, Math.min(maxX, centerX + xVariation))
      
      // Check if this position conflicts with existing or previously generated positions
      const conflicts = testPositions.some(pos => {
        const dx = finalX - pos.x
        const dy = finalY - pos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < MIN_SPACING
      })

      if (conflicts) {
        // Try alternative positions around the base position
        let foundPosition = false
        const attempts = [
          { x: finalX, y: finalY },
          { x: finalX + MIN_SPACING, y: finalY },
          { x: finalX - MIN_SPACING, y: finalY },
          { x: finalX, y: finalY + MIN_SPACING },
          { x: finalX, y: finalY - MIN_SPACING },
          { x: centerX, y: baseY },
        ]
        
        for (const attempt of attempts) {
          const clampedX = Math.max(minX, Math.min(maxX, attempt.x))
          const clampedY = Math.max(minY, Math.min(maxY, attempt.y))
          
          const stillConflicts = testPositions.some(pos => {
            const dx = clampedX - pos.x
            const dy = clampedY - pos.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            return distance < MIN_SPACING
          })
          
          if (!stillConflicts) {
            testPositions.push({ x: clampedX, y: clampedY })
            foundPosition = true
            break
          }
        }
        
        if (!foundPosition) {
          fits = false
        }
      } else {
        testPositions.push({ x: finalX, y: finalY })
      }
    })

    if (fits) {
      allObjectsFit = true
    } else {
      objectSize -= 5 // Reduce size by 5px and try again
    }
  }

  // Use the calculated size (or minimum if nothing fits)
  const finalObjectSize = Math.max(MIN_OBJECT_SIZE, objectSize)
  // Use object width for horizontal constraints (height is natural)
  const objectHalfWidth = finalObjectSize / 2
  const minX = HORIZONTAL_PADDING + objectHalfWidth
  const maxX = viewportWidth - HORIZONTAL_PADDING - objectHalfWidth
  // Vertical constraints use padding (objects can have natural heights)
  const minY = VERTICAL_PADDING
  const maxY = viewportHeight - VERTICAL_PADDING

  // Generate final positions (all within viewport: 0-100%)
  const positions: Array<{ id: string; x: number; y: number }> = []
  
  // First, add positions from Sanity (preserve existing positions)
  objectsWithPositions.forEach(obj => {
    positions.push({
      id: obj.id,
      x: obj.position!.x, // Already in percentage
      y: obj.position!.y, // Already in percentage
    })
  })

  // Then, generate positions for objects without coordinates
  const verticalSpacing = objectsWithoutPositions.length > 0
    ? availableHeight / (objectsWithoutPositions.length + 1)
    : availableHeight / 2

  objectsWithoutPositions.forEach((obj, index) => {
    // Base vertical position (evenly distributed)
    const baseY = VERTICAL_PADDING + (verticalSpacing * (index + 1))
    
    // Add deterministic variation (max 30% of spacing)
    const yVariation = getPositionVariation(obj.slug, 'y') * (verticalSpacing * 0.3)
    let finalY = Math.max(minY, Math.min(maxY, baseY + yVariation))
    
    // Horizontal position with deterministic variation
    const centerX = viewportWidth / 2
    const xVariation = getPositionVariation(obj.slug, 'x') * ((maxX - minX) * 0.4)
    let finalX = Math.max(minX, Math.min(maxX, centerX + xVariation))
    
    // Check for conflicts with existing positions and adjust if needed
    const allExistingPositions = [
      ...existingPositions,
      ...positions.map(p => ({
        x: (p.x / 100) * viewportWidth,
        y: (p.y / 100) * viewportHeight,
      })),
    ]
    
    let attempts = 0
    const maxAttempts = 20
    while (attempts < maxAttempts) {
      const conflicts = allExistingPositions.some(pos => {
        const dx = finalX - pos.x
        const dy = finalY - pos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < MIN_SPACING
      })
      
      if (!conflicts) {
        break
      }
      
      // Try alternative positions
      const alternatives = [
        { x: finalX + MIN_SPACING, y: finalY },
        { x: finalX - MIN_SPACING, y: finalY },
        { x: finalX, y: finalY + MIN_SPACING },
        { x: finalX, y: finalY - MIN_SPACING },
        { x: centerX, y: baseY },
      ]
      
      let foundAlternative = false
      for (const alt of alternatives) {
        const clampedX = Math.max(minX, Math.min(maxX, alt.x))
        const clampedY = Math.max(minY, Math.min(maxY, alt.y))
        
        const stillConflicts = allExistingPositions.some(pos => {
          const dx = clampedX - pos.x
          const dy = clampedY - pos.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          return distance < MIN_SPACING
        })
        
        if (!stillConflicts) {
          finalX = clampedX
          finalY = clampedY
          foundAlternative = true
          break
        }
      }
      
      if (!foundAlternative) {
        // Last resort: use grid-based positioning
        const cols = Math.ceil(Math.sqrt(objectsWithoutPositions.length))
        const col = index % cols
        const row = Math.floor(index / cols)
        const xStep = (maxX - minX) / (cols + 1)
        const yStep = (maxY - minY) / (Math.ceil(objectsWithoutPositions.length / cols) + 1)
        finalX = minX + xStep * (col + 1)
        finalY = minY + yStep * (row + 1)
        break
      }
      
      attempts++
    }
    
    // Convert to percentages (0-100% of viewport)
    positions.push({
      id: obj.id,
      x: (finalX / viewportWidth) * 100,
      y: (finalY / viewportHeight) * 100,
    })
  })

  return {
    canvasHeight: viewportHeight, // Always equals viewport
    objectSize: finalObjectSize,
    positions,
  }
}

// Export legacy name for backward compatibility during transition
export const calculateOptimalLayout = calculateWorkspaceLayout
export type OptimalLayout = WorkspaceLayout
