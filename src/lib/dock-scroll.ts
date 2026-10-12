/**
 * Scroll intent for the floating navigation dock.
 *
 * Ignore tiny reversals caused by touch inertia, a mouse wheel or browser UI
 * resizing. A deliberate ascent reveals the dock promptly, whereas hiding
 * requires sustained downward travel. This utility is free of DOM/React state
 * so its behaviour can be regression-tested without a browser.
 */
export type DockScrollDirection = "up" | "down" | null;

export type DockScrollState = {
  lastY: number;
  direction: DockScrollDirection;
  distance: number;
  hidden: boolean;
};

const TOP_RESET_Y = 140;
const DOWN_HIDE_Y = 240;
const DOWN_HIDE_DISTANCE = 112;
const UP_SHOW_DISTANCE = 12;
const MIN_DELTA = 0.5;
const MAX_JUMP = 700;

export function initialDockScrollState(y = 0): DockScrollState {
  return { lastY: Math.max(0, y), direction: null, distance: 0, hidden: false };
}

export function nextDockScrollState(state: DockScrollState, rawY: number): DockScrollState {
  const y = Math.max(0, rawY);
  const delta = y - state.lastY;

  if (y < TOP_RESET_Y) {
    return { lastY: y, direction: null, distance: 0, hidden: false };
  }

  // Crossing the first section, a hash jump or a browser scroll restoration
  // must not immediately hide the navigation on its first appearance.
  if (state.lastY < TOP_RESET_Y || Math.abs(delta) > MAX_JUMP) {
    return { ...state, lastY: y, direction: null, distance: 0 };
  }

  if (Math.abs(delta) < MIN_DELTA) {
    return { ...state, lastY: y };
  }

  const direction: DockScrollDirection = delta > 0 ? "down" : "up";
  const distance = Math.min(250, (state.direction === direction ? state.distance : 0) + Math.abs(delta));

  // Revealing is intentionally quicker than hiding; an incidental small
  // downward correction while going up never hides an already visible dock.
  let hidden = state.hidden;
  if (direction === "up" && distance >= UP_SHOW_DISTANCE) hidden = false;
  if (direction === "down" && y > DOWN_HIDE_Y && distance >= DOWN_HIDE_DISTANCE) hidden = true;

  return { lastY: y, direction, distance, hidden };
}
