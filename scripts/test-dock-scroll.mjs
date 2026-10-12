import { strict as assert } from "node:assert";
import { initialDockScrollState, nextDockScrollState } from "../src/lib/dock-scroll.ts";

const track = (values, start = 0) => {
  let state = initialDockScrollState(start);
  return values.map((y) => (state = nextDockScrollState(state, y)));
};

// Crossing the first section or jumping via an anchor must not hide the dock.
assert.equal(track([400])[0].hidden, false);
assert.equal(track([100, 150, 180])[2].hidden, false);

// A substantial sustained descent retracts it only after the reader has left
// the top of the page.
const descending = track([100, 150, 205, 270, 340]);
assert.equal(descending.at(-1).hidden, true);

// An intentional ascent reveals it. Tiny bouncing or wheel correction does
// not hide it again; it takes a fresh sustained descent.
let s = descending.at(-1);
s = nextDockScrollState(s, 330);
s = nextDockScrollState(s, 322);
assert.equal(s.hidden, false);
s = nextDockScrollState(s, 327);
s = nextDockScrollState(s, 331);
assert.equal(s.hidden, false);
s = nextDockScrollState(s, 324);
assert.equal(s.hidden, false);
s = nextDockScrollState(s, 450);
assert.equal(s.hidden, true);

// Back to the top, scroll restoration and viewport bounce reset the dock.
assert.equal(nextDockScrollState(s, 0).hidden, false);
assert.equal(nextDockScrollState(s, -20).hidden, false);
assert.equal(nextDockScrollState(s, 5000).hidden, true); // large jump preserves status
console.log("[dock-scroll] 11 navigation visibility assertions passed");
