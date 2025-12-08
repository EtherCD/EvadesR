export function diff<T extends object>(a: T, b: T): [Partial<T>, boolean] {
  const changes: Partial<T> = {};
  let containChanges = false;

  for (const k in b) {
    const valA = a[k];
    const valB = b[k];

    if (typeof valA === "boolean" || typeof valB === "boolean") {
      if (Boolean(valA) !== Boolean(valB)) {
        changes[k] = valB;
        containChanges = true;
      }
    } else if (typeof valA === "number" || typeof valB === "number") {
      if (Number(valA) !== Number(valB)) {
        changes[k] = valB;
        containChanges = true;
      }
    } else if (valA !== valB) {
      changes[k] = valB;
      containChanges = true;
    }
  }

  return [changes, containChanges];
}
