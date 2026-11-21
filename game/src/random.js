// A tiny deterministic random source (mulberry32) so every scene draws
// exactly the same stars, waves and blades of grass on both panels, on
// every machine, on every run. The two pictures differ only where a
// difference says they should.
export function makeRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random float between `min` and `max` from the given source. */
export function range(random, min, max) {
  return min + random() * (max - min);
}

/** A random integer between `min` and `max` (inclusive) from the source. */
export function integer(random, min, max) {
  return Math.floor(range(random, min, max + 1));
}

/** One item picked from `items` by the given source. */
export function pick(random, items) {
  return items[Math.floor(random() * items.length)];
}
