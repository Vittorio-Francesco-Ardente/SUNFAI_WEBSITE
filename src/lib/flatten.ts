/** Flatten a nested dictionary into "a.b.0.c" → string entries (review table, CSV export). */
export function flatten(obj: unknown, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (typeof obj === "string" || typeof obj === "number") {
    out[prefix] = String(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

/** Set a value at a flattened path (import of the reviewed CSV). */
export function setPath(obj: Record<string, unknown>, path: string, value: string) {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  keys.slice(0, -1).forEach((k) => (cur = cur[k] as Record<string, unknown>));
  cur[keys[keys.length - 1]] = value;
}
