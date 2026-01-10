import { WorkspaceObjectData } from '../types'

/**
 * generateObjectPositions
 * 
 * Generates random positions for objects that don't have coordinates.
 * Ensures objects don't overlap and have breathing space between them.
 * 
 * @param objects - Array of workspace objects (some may already have positions)
 * @returns Array of objects with positions assigned
 */
export function generateObjectPositions(
  objects: WorkspaceObjectData[]
): WorkspaceObjectData[] {
  // Safe bounds (matching clampObjectPosition)
  // Y max is 85% to account for object height (80px object at 85% Y is fully visible)
  const MIN_POSITION = 10
  const MAX_POSITION_X = 90
  const MAX_POSITION_Y = 85 // Reduced to account for object height
  
  // Minimum spacing between objects (as percentage)
  const MIN_SPACING = 15 // 15% minimum distance between object centers
  
  // Objects that already have positions
  const objectsWithPositions = objects.filter((obj) => obj.position !== undefined)
  const objectsWithoutPositions = objects.filter((obj) => obj.position === undefined)
  
  // If all objects have positions, return as-is
  if (objectsWithoutPositions.length === 0) {
    return objects
  }
  
  // Generate positions for objects without coordinates
  // Build array incrementally so we can check against previously generated positions
  const generatedPositions: WorkspaceObjectData[] = []
  
  objectsWithoutPositions.forEach((obj, index) => {
    let attempts = 0
    const maxAttempts = 100
    let position: { x: number; y: number } | undefined
    
    // Try to find a position that doesn't overlap
    while (attempts < maxAttempts && !position) {
      // Generate random position within bounds
      const candidateX = MIN_POSITION + Math.random() * (MAX_POSITION_X - MIN_POSITION)
      const candidateY = MIN_POSITION + Math.random() * (MAX_POSITION_Y - MIN_POSITION)
      
      // Check if this position conflicts with existing positions
      const allExistingObjects = [
        ...objectsWithPositions,
        ...generatedPositions, // Check against already-generated positions
      ]
      
      const conflicts = allExistingObjects.some((existingObj) => {
        if (!existingObj.position) return false
        
        const dx = Math.abs(candidateX - existingObj.position.x)
        const dy = Math.abs(candidateY - existingObj.position.y)
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Check if too close (within minimum spacing)
        return distance < MIN_SPACING
      })
      
      if (!conflicts) {
        position = { x: candidateX, y: candidateY }
      }
      
      attempts++
    }
    
    // If we couldn't find a non-conflicting position after max attempts,
    // use a grid-based fallback to ensure no overlaps
    if (!position) {
      // Calculate grid positions based on total objects needing positions
      const totalObjectsNeedingPositions = objectsWithoutPositions.length
      const cols = Math.ceil(Math.sqrt(totalObjectsNeedingPositions))
      const rows = Math.ceil(totalObjectsNeedingPositions / cols)
      
      const col = index % cols
      const row = Math.floor(index / cols)
      
      // Distribute evenly across available space with spacing
      const xStep = (MAX_POSITION_X - MIN_POSITION) / (cols + 1)
      const yStep = (MAX_POSITION_Y - MIN_POSITION) / (rows + 1)
      
      position = {
        x: MIN_POSITION + xStep * (col + 1),
        y: MIN_POSITION + yStep * (row + 1),
      }
    }
    
    generatedPositions.push({
      ...obj,
      position,
    })
  })
  
  // Combine objects with existing positions and newly generated positions
  return [...objectsWithPositions, ...generatedPositions]
}
