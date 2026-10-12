/**
 * Floating dock visibility, independent of scroll direction.
 *
 * The dock becomes visible shortly after leaving the top of the page and
 * remains visible through all upward/downward scrolling. It disappears only
 * upon returning to the very beginning of the document.
 *
 * Two close thresholds prevent browser bounce near scrollY=0 from causing
 * repeated mounts/unmounts of the animated dock.
 */
export type DockScrollState = {
  lastY: number;
  visible: boolean;
};

const SHOW_Y = 12;
const RESET_Y = 2;

export function initialDockScrollState(rawY = 0): DockScrollState {
  const y = Math.max(0, rawY);
  return { lastY: y, visible: y >= SHOW_Y };
}

export function nextDockScrollState(state: DockScrollState, rawY: number): DockScrollState {
  const y = Math.max(0, rawY);
  const visible = y <= RESET_Y ? false : y >= SHOW_Y ? true : state.visible;
  return { lastY: y, visible };
}
