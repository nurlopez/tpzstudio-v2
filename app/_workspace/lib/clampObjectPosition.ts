/**
 * clampObjectPosition
 * 
 * TEMPORARY SAFETY NET: Ensures workspace objects are always visible.
 * 
 * This is a development constraint, not a final UX decision.
 * Future: Replace with proper layout system or pan/zoom.
 * 
 * Clamps X/Y percentage values to safe viewport bounds:
 * - X: 10% to 90% (accounts for object width and padding)
 * - Y: 10% to 85% (accounts for object height - object is 80px, so 85% ensures full visibility)
 * 
 * Note: Objects are centered at their position (transform: translate(-50%, -50%))
 * So an object at 90% Y would have its center at 90%, meaning bottom extends to 90% + 40px
 * To ensure full visibility, we clamp Y to 85% max so object bottom stays within container
 * 
 * @param position - Original position from Sanity or mock data
 * @returns Clamped position within safe bounds
 */
export function clampObjectPosition(
  position?: { x: number; y: number }
): { x: number; y: number } | undefined {
  if (!position) {
    return undefined
  }

  // Safe bounds:
  // X: 10% to 90% (object is 80px wide, so 40px radius fits within bounds)
  // Y: 10% to 85% (object is 80px tall, so at 85% Y, bottom is at 85% + 40px = safe)
  // Container is 130vh, so 85% of 130vh = 110.5vh, plus 40px ≈ 111vh, which is scrollable
  const MIN_POSITION = 10
  const MAX_POSITION_X = 90
  const MAX_POSITION_Y = 85 // Reduced to 85% to account for object height

  return {
    x: Math.max(MIN_POSITION, Math.min(MAX_POSITION_X, position.x)),
    y: Math.max(MIN_POSITION, Math.min(MAX_POSITION_Y, position.y)),
  }
}
