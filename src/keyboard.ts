/** Three.js/world coordinates: positive Y goes UP the screen. */
export function directionForKey(key: string): -1 | 1 | null {
  if (key === 'ArrowUp' || key === 'ArrowLeft') return 1;
  if (key === 'ArrowDown' || key === 'ArrowRight') return -1;
  return null;
}
