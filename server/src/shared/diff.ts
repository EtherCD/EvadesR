export function diff<T extends object>(a: T, b: T): [Partial<T>, boolean] {
	const changes: Partial<T> = {};
	let containChanges = false;
	for (const k in b) {
		if (a[k] !== b[k]) {
			changes[k] = b[k];
			containChanges = true;
		}
	}
	return [changes, containChanges];
}
