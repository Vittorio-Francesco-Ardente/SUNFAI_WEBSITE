import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { initialDockScrollState, nextDockScrollState } from "../src/lib/dock-scroll.ts";

function visibilityAt(values, start = 0) {
  let state = initialDockScrollState(start);
  return values.map((y) => {
    state = nextDockScrollState(state, y);
    return state.visible;
  });
}

// Initially hidden; visible on the first meaningful scroll.
assert.equal(initialDockScrollState(0).visible, false);
assert.deepEqual(visibilityAt([0, 5, 11, 12, 25]), [false, false, false, true, true]);

// Keep the dock visible when going down, including long descents.
assert.deepEqual(visibilityAt([15, 150, 500, 950, 2500, 6000]), [true, true, true, true, true, true]);

// Keep the dock visible through any partial upward travel or direction reversal.
assert.deepEqual(visibilityAt([600, 480, 300, 320, 180, 65, 5]), [true, true, true, true, true, true, true]);

// Only reaching the beginning of the scrollbar closes the dock.
assert.deepEqual(visibilityAt([40, 8, 3, 2, 1, 0, 3, 12]), [true, true, true, false, false, false, false, true]);

// Opening a deep link / restoring scroll on mount shows the dock immediately.
assert.equal(initialDockScrollState(780).visible, true);
assert.equal(nextDockScrollState(initialDockScrollState(780), -15).visible, false);

// Regression: both dock variants must consume the same persistent state;
// the active-page orange dots must be entirely absent.
const nav = readFileSync(new URL("../src/components/nav/NavShell.tsx", import.meta.url), "utf8");
assert.equal((nav.match(/visible=\{dockVisible && !sheet\}/g) || []).length, 2);
assert.ok(!nav.includes("dockReading"));
assert.ok(!nav.includes('size-[5px] -translate-x-1/2 rounded-full bg-orange'));
console.log("[dock-scroll] visibility + desktop/mobile rendering regression checks passed");
