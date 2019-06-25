import { isEqual } from 'date-fns';

export function deepEqual(x, y) {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  if (!x || !y || tx !== ty)
    return x === y;

  if (x instanceof Date && y instanceof Date)
    return isEqual(x, y);

  return tx === 'object' ?
    (ok(x).length === ok(y).length && ok(x).every(key => deepEqual(x[key], y[key])) ) : 
    (x === y);
}

export function doLater(fn): void {
  setTimeout(fn, 0);
}
